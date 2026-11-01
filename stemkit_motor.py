
try:
    from yolobit import *
    import machine
    from machine import *
    import time
    from utility import *
    import stemkit_pcf8574
    import stemkit_hcsr04
    print('Import Robot done')

except KeyboardInterrupt as err:
    print('Import interrupted')
    for m in ['yolobit', 'machine', 'stemkit_pcf8574', 'stemkit_hcsr04']:
        if m in sys.modules:
            del sys.modules[m]

class Motor():

    def __init__(self):
        # motor pins
        self.ina1 = PWM(Pin(pin12.pin), freq=500, duty=0)
        self.ina2 = PWM(Pin(pin2.pin), freq=500, duty=0)

        self.inb1 = PWM(Pin(pin10.pin), freq=500, duty=0)
        self.inb2 = PWM(Pin(pin15.pin), freq=500, duty=0)

        self.m1_speed = 0
        self.m2_speed = 0

        # line IR sensors
        try:
            self.pcf = stemkit_pcf8574.PCF8574(
                machine.SoftI2C(
                    scl=machine.Pin(pin19.pin),
                    sda=machine.Pin(pin20.pin)), 0x23)
        except:
            say('Line IR sensors not detected')
            self.pcf = None
            
        self.stop()
        


    def forward(self, speed, t=None):
        self.set_wheel_speed(speed, -speed)
        if t != None:
            time.sleep(t)
            self.stop()

    def backward(self, speed, t=None):
        self.set_wheel_speed(-speed, speed)
        if t != None:
            time.sleep(t)
            self.stop()

    def turn_right(self, speed, t=None):
        self.set_wheel_speed(speed, speed)
        if t != None:
            time.sleep(t)
            self.stop()

    def turn_left(self, speed, t=None):
        self.set_wheel_speed(-speed, -speed)
        if t != None:
            time.sleep(t)
            self.stop()

    def stop(self):
        self.set_wheel_speed(0, 0)
        time.sleep_ms(20)

    def set_wheel_speed(self, m1=None, m2=None):

        # logic to smoothen motion, avoid voltage spike
        # if wheel speed change > 100, need to change to 30 first
        if (m1 != None and m2 != None and m1 != 0 and abs(m1 - self.m1_speed) > 100) and (m2 != 0 and abs(m2 - self.m2_speed) > 100):
            
            if m1 > 0:
                # Forward
                self.ina1.duty(int(translate(30, 0, 100, 0, 1023)))
                self.ina2.duty(0)
                
            elif m1 < 0:
                # Backward
                self.ina1.duty(0)
                self.ina2.duty(int(translate(30, 0, 100, 0, 1023)))

            if m2 > 0:
                # Forward
                self.inb1.duty(int(translate(30, 0, 100, 0, 1023)))
                self.inb2.duty(0)
                
            elif m2 < 0:
                # Backward
                self.inb1.duty(0)
                self.inb2.duty(int(translate(30, 0, 100, 0, 1023)))

            time.sleep_ms(200)

        if m1 != None :
            if m1 >= 0:
                # Forward
                if m1 > 100:
                    m1 = 100
                    
                self.ina1.duty(int(translate(abs(m1), 0, 100, 0, 1023)))
                self.ina2.duty(0)
                
            elif m1 < 0:
                # Backward
                if m1 < -100:
                    m1 = -100
                    
                self.ina1.duty(0)
                self.ina2.duty(int(translate(abs(m1), 0, 100, 0, 1023)))
            
            self.m1_speed = m1

        if m2 != None:
            if m2 >= 0:
                # Forward
                if m2 > 100:
                    m2 = 100
                    
                self.inb1.duty(int(translate(abs(m2), 0, 100, 0, 1023)))
                self.inb2.duty(0)
                
            elif m2 < 0:
                # Backward
                if m2 < -100:
                    m2 = -100
                    
                self.inb2.duty(int(translate(abs(m2), 0, 100, 0, 1023)))
                self.inb1.duty(0)

            self.m2_speed = m2

    def read_line_sensors(self, index=0):
        '''
        self.pcf.pin(0) = 0 white line
        self.pcf.pin(0) = 1 black line
        '''

        #self.pcf.port |= 0x0F # It's only use for Rover with 2 white led.

        if index < 0 or index > 4:
            return 1

        if index == 0:
            if self.pcf:
                return (self.pcf.pin(0), self.pcf.pin(1), self.pcf.pin(2), self.pcf.pin(3))
            else:
                return (1, 1, 1, 1)  # cannot detect black line
        else:
            if self.pcf:
                return self.pcf.pin(index-1)
            else:
                return 1

motor = Motor()

def stop_all():  # override stop function called by app
    motor.stop()
