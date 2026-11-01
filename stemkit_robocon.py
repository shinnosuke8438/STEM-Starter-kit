import time
from machine import Pin, SoftI2C
from stemkit_motor import *

STOP = const(0)
BRAKE = const(1)

def stop_robot(then=STOP):
    if then == STOP:
        motor.stop()
    elif then == BRAKE:
        motor.ina1.duty(1023)
        motor.ina2.duty(1023)
        motor.inb1.duty(1023)
        motor.inb2.duty(1023)
        time.sleep_ms(150)
        motor.stop()
    else:
        return

speed_factors = [ 
    [1, 1], [0.5, 1], [0, 1], [-0.5, 0.5], 
    [-2/3, -2/3], [0, 1], [-0.5, 0.5], [-0.7, 0.7] 
] #0: forward, 1: light turn, 2: normal turn, 3: heavy turn, 4:  backward, 5: strong light turn, 6: strong normal turn, 7: strong heavy turn


m_dir = -1 #no found
i_lr = 0 #0 for left, 1 for right
t_finding_point = time.time_ns()
s1_current_position = -1
s2_current_position = -1

# ---- Cam bien do line ----
# Stem Kit dung cam bien 4 mat (PCF8574 0x23). Cam them "5 Channel Line Finder Array"
# (STM32G030, I2C 0x24) vao cong I2C thi thu vien tu dung cam bien 5 mat.
LINE_AUTO = 'auto'
LINE_STEMKIT = 'stemkit'
LINE_ARRAY5 = 'array5'

LINE5_ADDR = const(0x24)
LINE5_REG_WHO = const(0x00)
LINE5_REG_TUPLE = const(0x06)   # 1 byte, bit4 = S1 .. bit0 = S5
LINE5_REG_RAW = const(0x10)     # 5 x uint16 LE, thu tu S5..S1

_line_type = LINE_AUTO
_line5_i2c = None   # None: chua do tim; False: khong co cam bien 5 mat
_line5_last = (0, 0, 0, 0, 0)

def _line5_bus():
    # Tim cam bien 5 mat tren bus I2C (chi tim 1 lan)
    global _line5_i2c
    if _line5_i2c is None:
        _line5_i2c = False
        try:
            i2c = SoftI2C(scl=Pin(pin19.pin), sda=Pin(pin20.pin), freq=100000)
            if LINE5_ADDR in i2c.scan() and i2c.readfrom_mem(LINE5_ADDR, LINE5_REG_WHO, 1)[0] == LINE5_ADDR:
                _line5_i2c = i2c
        except Exception:
            _line5_i2c = False
    return _line5_i2c

def line_sensor_type(type=None):
    '''
        Chon cam bien do line cho cac lenh do line:
            LINE_AUTO (mac dinh) - dung cam bien 5 mat neu tim thay, neu khong dung cam bien 4 mat
            LINE_STEMKIT - luon dung cam bien 4 mat (PCF8574)
            LINE_ARRAY5 - luon dung cam bien 5 mat
        Khong truyen tham so: tra ve loai cam bien dang dung (LINE_STEMKIT hoac LINE_ARRAY5).
    '''
    global _line_type
    if type is None:
        if _line_type == LINE_ARRAY5 or (_line_type == LINE_AUTO and _line5_bus()):
            return LINE_ARRAY5
        return LINE_STEMKIT
    _line_type = type

def read_line_array5(index=None):
    '''
        Doc cam bien do line 5 mat: tuple (S1, S2, S3, S4, S5), S1 la mat ben trai,
        1 = thay vach den. index 1..5 de doc 1 mat.
    '''
    global _line5_last
    i2c = _line5_bus()
    if i2c:
        try:
            b = i2c.readfrom_mem(LINE5_ADDR, LINE5_REG_TUPLE, 1)[0]
            _line5_last = ((b >> 4) & 1, (b >> 3) & 1, (b >> 2) & 1, (b >> 1) & 1, b & 1)
        except OSError:
            pass # loi bus thoang qua: giu gia tri doc lan truoc
    if index:
        return _line5_last[index - 1]
    return _line5_last

def read_line_array5_raw(index=None):
    '''
        Gia tri analog 12-bit cua cam bien 5 mat (S1 truoc), index 1..5 de doc 1 mat.
    '''
    vals = (0, 0, 0, 0, 0)
    i2c = _line5_bus()
    if i2c:
        try:
            d = i2c.readfrom_mem(LINE5_ADDR, LINE5_REG_RAW, 10)
            vals = tuple(d[(4 - i) * 2] | (d[(4 - i) * 2 + 1] << 8) for i in range(5))
        except OSError:
            pass
    if index:
        return vals[index - 1]
    return vals

def read_line_sensors():
    '''
        Doc cam bien do line dang dung: tuple 4 phan tu hoac 5 phan tu (cam bien 5 mat).
    '''
    if line_sensor_type() == LINE_ARRAY5:
        return read_line_array5()
    return motor.read_line_sensors()

def _is_cross(now):
    # Vach ngang: 4 mat deu den; 5 mat: 2 mat ngoai cung cung den
    if len(now) == 5:
        return bool(now[0] and now[4])
    return now == (1, 1, 1, 1)

def _line5_turn(now):
    # Cam bien 5 mat: vi tri line = trung binh trong so cac mat thay den (S1 = -2 .. S5 = +2).
    # Tra ve (m_dir, i_lr) theo bang speed_factors, hoac None khi line o giua (di thang).
    n = 0
    acc = 0
    for i in range(5):
        if now[i]:
            acc += i - 2
            n += 1
    p = acc / n
    if _is_cross(now) or abs(p) <= 0.5:
        return None
    i_lr = 0 if p < 0 else 1 # 0: line ben trai -> re trai
    a = abs(p)
    if a <= 1:
        return 1, i_lr # re nhe
    if a <= 1.5:
        return 2, i_lr # re vua
    return 3, i_lr # re gat

def follow_line(speed, now=None, backward=True):
    global m_dir, i_lr, t_finding_point
    if now == None:
        now = read_line_sensors()

    if not any(now): #no line found
        if backward:
            motor.backward(speed)
    elif len(now) == 5:
        turn = _line5_turn(now)
        if turn is None:
            if m_dir == 0:
                motor.set_wheel_speed(speed, -speed)
            else:
                m_dir = 0
                motor.set_wheel_speed(speed * 2/3, -(speed * 2/3))
        else:
            m_dir, i_lr = turn
            motor.set_wheel_speed( speed * speed_factors[m_dir][i_lr], -(speed * speed_factors[m_dir][1-i_lr] ))
    else:
        if (now[1], now[2]) == (1, 1):
            if m_dir == 0:
                motor.set_wheel_speed(speed, -speed) #if it is running straight before then robot should speed up now           
            else:
                m_dir = 0 #forward
                motor.set_wheel_speed(speed * 2/3, -(speed * 2/3)) #just turn before, shouldn't set high speed immediately, speed up slowly
        else:
            if (now[0], now[1]) == (1, 1): 
                m_dir = 2 #left normal turn
                i_lr = 0
            elif (now[2], now[3]) == (1, 1): 
                m_dir = 2 #right normal turn
                i_lr = 1
            elif now == (1, 0, 1, 0): 
                if m_dir != -1:
                    m_dir = 1
                    i_lr = 0
            elif now == (0, 1, 0, 1): 
                if m_dir != -1:
                    m_dir = 1
                    i_lr = 1
            elif now == (1, 0, 0, 1): 
                if m_dir != -1:
                    m_dir = 0
                    i_lr = 0
            elif now[1] == 1: 
                m_dir = 1 #left light turn
                i_lr = 0
            elif now[2] == 1:
                m_dir = 1 #right light turn
                i_lr = 1
            elif now[0] == 1: 
                m_dir = 3 #left heavy turn
                i_lr = 0
            elif now[3] == 1: 
                m_dir = 3 #right heavy turn
                i_lr = 1

            motor.set_wheel_speed( speed * speed_factors[m_dir][i_lr], -(speed * speed_factors[m_dir][1-i_lr] ))


def follow_line_until_end(speed, timeout=10000, then=STOP):
    count = 3
    last_time = time.ticks_ms()

    while time.ticks_ms() - last_time < timeout:
        now = read_line_sensors()

        if not any(now):
            count = count - 1
            if count == 0:
                break

        if speed >= 0:
            follow_line(speed, now, False)
        else:
            motor.backward(abs(speed))

        time.sleep_ms(10)

    stop_robot(then)

def follow_line_until_cross(speed, timeout=10000, then=STOP):
    status = 1
    count = 0
    last_time = time.ticks_ms()

    while time.ticks_ms() - last_time < timeout:
        now = read_line_sensors()

        if status == 1:
            if not _is_cross(now):
                status = 2
        elif status == 2:
            if _is_cross(now):
                count = count + 1
                if count == 2:
                    break

        if speed >= 0:
            follow_line(speed, now)
        else:
            motor.backward(abs(speed))

        time.sleep_ms(10)

    motor.forward(speed, 0.1)
    stop_robot(then)

def follow_line_until(speed, condition, timeout=10000, then=STOP):
    status = 1
    count = 0
    last_time = time.ticks_ms()

    while time.ticks_ms() - last_time < timeout:
        now = read_line_sensors()

        if status == 1:
            if not _is_cross(now):
                status = 2
        elif status == 2:
            if condition():
                count = count + 1
                if count == 2:
                    break

        if speed >= 0:
            follow_line(speed, now)
        else:
            motor.backward(abs(speed))

        time.sleep_ms(10)

    stop_robot(then)

def turn_until_line_detected(m1_speed, m2_speed, timeout=5000, then=STOP):
    counter = 0
    status = 0
  
    last_time = time.ticks_ms()

    motor.set_wheel_speed(m1_speed, -(m2_speed))

    while time.ticks_ms() - last_time < timeout:
        line_status = read_line_sensors()

        if status == 0:
            if not any(line_status): # no black line detected
                # ignore case when robot is still on black line since started turning
                status = 1
        
        elif status == 1:
            motor.set_wheel_speed(m1_speed, -(m2_speed))
            status = 2
            counter = 3
        elif status == 2:
            if any(line_status):
                motor.set_wheel_speed(int(m1_speed*0.75), int(-(m2_speed*0.75)))
                counter = counter - 1
                if counter <= 0:
                    break

        time.sleep_ms(10)

    stop_robot(then)

def turn_until_condition(m1_speed, m2_speed, condition, timeout=5000, then=STOP):
    count = 0

    motor.set_wheel_speed(m1_speed, -m2_speed)

    last_time = time.ticks_ms()

    while time.ticks_ms() - last_time < timeout:
        if condition():
            count = count + 1
            if count == 3:
                break
        time.sleep_ms(10)

    stop_robot(then)


