"""
MicroPython MPR121 capacitive touch keypad and breakout board driver
Optimized for Yolo:Bit & Sound JQ8400 Module (Bật âm thanh bíp)
"""
from yolobit import *
from micropython import const
import ustruct, time
import _thread
from machine import SoftI2C, Pin
import music  # Đã khôi phục thư viện music để dùng còi báo

MPR121_TOUCH_STATUS = const(0x00)
MPR121_ELECTRODE_FILTERED_DATA = const(0x04)
MPR121_BASELINE_VALUE = const(0x1E)
MPR121_MAX_HALF_DELTA_RISING = const(0x2B)
MPR121_NOISE_HALF_DELTA_RISING = const(0x2C)
MPR121_NOISE_COUNT_LIMIT_RISING = const(0x2D)
MPR121_FILTER_DELAY_COUNT_RISING = const(0x2E)
MPR121_MAX_HALF_DELTA_FALLING = const(0x2F)
MPR121_NOISE_HALF_DELTA_FALLING = const(0x30)
MPR121_NOISE_COUNT_LIMIT_FALLING = const(0x31)
MPR121_FILTER_DELAY_COUNT_FALLING = const(0x32)
MPR121_NOISE_HALF_DELTA_TOUCHED = const(0x33)
MPR121_NOISE_COUNT_LIMIT_TOUCHED = const(0x34)
MPR121_FILTER_DELAY_COUNT_TOUCHED = const(0x35)
MPR121_TOUCH_THRESHOLD = const(0x41)
MPR121_RELEASE_THRESHOLD = const(0x42)
MPR121_DEBOUNCE = const(0x5B)
MPR121_CONFIG1 = const(0x5C)
MPR121_CONFIG2 = const(0x5D)
MPR121_ELECTRODE_CONFIG = const(0x5E)
MPR121_SOFT_RESET = const(0x80)

class MPR121:
    KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '#']

    def __init__(self, i2c=None, address=0x5A):
        if i2c == None:
            self.i2c = SoftI2C(scl=Pin(pin19.pin), sda=Pin(pin20.pin), freq=200000)
        else:
            self.i2c = i2c
        self.address = address
        self._input = ''
        self.sound = True  # BẬT LẠI ÂM THANH MẶC ĐỊNH
        self.reset()
        _thread.start_new_thread(self.run, ())

    def _register8(self, register, value=None):
        try:
            if value is None:
                return self.i2c.readfrom_mem(self.address, register, 1)[0]
            self.i2c.writeto_mem(self.address, register, bytearray([value]))
        except OSError:
            return 0

    def _register16(self, register, value=None):
        try:
            if value is None:
                data = self.i2c.readfrom_mem(self.address, register, 2)
                return ustruct.unpack("<H", data)[0]
            self.i2c.writeto_mem(self.address, register, ustruct.pack("<H", value))
        except OSError:
            return 0

    def reset(self):
        self._register8(MPR121_SOFT_RESET, 0x63)
        self._register8(MPR121_ELECTRODE_CONFIG, 0x00)

        # Chống chạm nhầm: Ngưỡng nhận diện cao hơn
        self.set_thresholds(40, 20)

        self._register8(MPR121_MAX_HALF_DELTA_RISING, 0x01)
        self._register8(MPR121_MAX_HALF_DELTA_FALLING, 0x01)
        self._register8(MPR121_NOISE_HALF_DELTA_RISING, 0x01)
        self._register8(MPR121_NOISE_HALF_DELTA_FALLING, 0x05)
        self._register8(MPR121_NOISE_HALF_DELTA_TOUCHED, 0x00)
        self._register8(MPR121_NOISE_COUNT_LIMIT_RISING, 0x0E)
        self._register8(MPR121_NOISE_COUNT_LIMIT_FALLING, 0x01)
        self._register8(MPR121_NOISE_COUNT_LIMIT_TOUCHED, 0x00)
        self._register8(MPR121_FILTER_DELAY_COUNT_RISING, 0x00)
        self._register8(MPR121_FILTER_DELAY_COUNT_FALLING, 0x00)
        self._register8(MPR121_FILTER_DELAY_COUNT_TOUCHED, 0x00)
        
        # Bật khử nhiễu (Debounce)
        self._register8(MPR121_DEBOUNCE, 0x33)
        
        self._register8(MPR121_CONFIG1, 0x10)
        self._register8(MPR121_CONFIG2, 0x20)
        self._register8(MPR121_ELECTRODE_CONFIG, 0x8F)
        self._input = '' 

    def set_thresholds(self, touch, release, electrode=None):
        if not 0 <= touch <= 255 or not 0 <= release <= 255:
            return
        f = 0 if electrode is None else electrode
        t = 12 if electrode is None else electrode + 1

        config = self._register8(MPR121_ELECTRODE_CONFIG)
        if config != 0:
            self._register8(MPR121_ELECTRODE_CONFIG, 0)

        for i in range(f, t):
            self._register8(MPR121_TOUCH_THRESHOLD + i * 2, touch)
            self._register8(MPR121_RELEASE_THRESHOLD + i * 2, release)

        if config != 0:
            self._register8(MPR121_ELECTRODE_CONFIG, config)

    def filtered_data(self, electrode):
        return self._register16(MPR121_ELECTRODE_FILTERED_DATA + electrode * 2)

    def baseline_data(self, electrode):
        return self._register8(MPR121_BASELINE_VALUE + electrode) << 2

    def touched(self):
        # Chống văng mạch khi cáp rung lắc
        try:
            return self._register16(MPR121_TOUCH_STATUS)
        except OSError:
            return 0
  
    def is_touched(self, electrode):
        if electrode == '*':
            electrode = 10
        if electrode == '#':
            electrode = 11
        z = int(electrode)
        
        if not 0 <= z <= 11:
            return False
        if z == 0:
            z = 4
        elif z == 11:
            z = 8
        else :
            y = 3-(z//3)
            if z % 3 == 0:
                y = y + 1
            x = z - (3-y)*3-1
            z = 4*x + y
        
        t = self.touched()
        return (t & (1 << z)) != 0
    
    def run(self):
        last_pressed = [] 
        while True:
            try:
                current_pressed = []
                touched = False
                
                for i in range(len(self.KEYS)):
                    if self.is_touched(i):
                        current_pressed.append(i)
                        
                        if i not in last_pressed:
                            self._input += self.KEYS[i]
                            touched = True
                
                last_pressed = current_pressed
                
                if touched:
                    if self.sound:
                        # Tiếng bíp cực ngắn và cao để báo hiệu (như tiếng gõ phím)
                        music.play(['G5:0.05'], wait=True)
                        time.sleep_ms(150)
                    else:
                        time.sleep_ms(150)
                else:
                    time.sleep_ms(50)
            except OSError:
                time.sleep_ms(100)
    
    def scan(self):
        for i in range(len(self.KEYS)):
            if self.is_touched(i):
                time.sleep_ms(200)
                return i
        return -1

    def clear(self):
        self._input = ''

    def read(self):
        return self._input

touchpad = MPR121()