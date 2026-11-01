import machine, time
from machine import Pin

__version__ = '0.2.0'
__author__ = 'Roberto Sánchez'
__license__ = "Apache License 2.0. https://www.apache.org/licenses/LICENSE-2.0"

_MAX_DISTANCE_CM = const(200) #cm

class HCSR04:
    """
    Driver to use the untrasonic sensor HC-SR04.
    The sensor range is between 2cm and 4m.
    The timeouts received listening to echo pin are converted to OSError('Out of range')
    """
    # echo_timeout_us is based in chip range limit (400cm)
    def __init__(self, trigger_pin, echo_pin, echo_timeout_us=500*2*30):
        """
        trigger_pin: Output pin to send pulses
        echo_pin: Readonly pin to measure the distance. The pin should be protected with 1k resistor
        echo_timeout_us: Timeout in microseconds to listen to echo pin. 
        By default is based in sensor limit range (4m)
        """
        self.echo_timeout_us = echo_timeout_us
        self._ars = []
        self._ats = []
        # Init trigger pin (out)
        self.trigger = Pin(trigger_pin, mode=Pin.OUT, pull=None)
        self.trigger.value(0)

        # Init echo pin (in)
        self.echo = Pin(echo_pin, mode=Pin.IN, pull=None)

    def _send_pulse_and_wait(self):
        """
        Send the pulse to trigger and listen on echo pin.
        We use the method `machine.time_pulse_us()` to get the microseconds until the echo is received.
        """
        self.trigger.value(0) # Stabilize the sensor
        time.sleep_us(5)
        self.trigger.value(1)
        # Send a 10us pulse.
        time.sleep_us(10)
        self.trigger.value(0)
        try:
            pulse_time = machine.time_pulse_us(self.echo, 1, self.echo_timeout_us)
            return pulse_time
        except OSError as ex:
            if ex.args[0] == 110: # 110 = ETIMEDOUT
                raise OSError('Out of range')
            raise ex

    def distance_mm(self):
        return self.distance_cm()*10

    def distance_cm(self, filter=True):
        """
        Get the distance in centimeters with floating point operations.
        It returns a float
        """
        pulse_time = self._send_pulse_and_wait()

        # To calculate the distance we get the pulse_time and divide it by 2 
        # (the pulse walk the distance twice) and by 29.1 becasue
        # the sound speed on air (343.2 m/s), that It's equivalent to
        # 0.034320 cm/us that is 1cm each 29.1us
        cms = (pulse_time / 2) / 29.1
        
        if cms < 0 or cms > _MAX_DISTANCE_CM:
            cms = _MAX_DISTANCE_CM

        if not filter:
            return cms
        
        self._ars.append(cms)
        self._ats.append(time.time_ns())
        if len(self._ars) > 5:
            self._ars.pop(0)
            self._ats.pop(0)
        while True:
            if self._ats[len(self._ats) - 1] - self._ats[0] > 5e8:
                self._ars.pop(0)
                self._ats.pop(0)
            else:
                break
        if len(self._ars) < 2:
            time.sleep_ms(30)
            pulse_time = self._send_pulse_and_wait()
            cms = (pulse_time / 2) / 29.1
            if cms < 0 or cms > _MAX_DISTANCE_CM:
                cms = _MAX_DISTANCE_CM
            self._ars.append(cms)
            self._ats.append(time.time_ns())
        
        N = len(self._ars)
        Fi = Fd = [1] * N
        maxd = vald = 0
        for i in range(N):
            for j in range(i):
                if (self._ars[i] >= self._ars[j]) and (self._ars[i] - self._ars[j]) < 10:
                    Fi[i] = max(Fi[i], Fi[j] + 1)
                if (self._ars[i] <= self._ars[j]) and (self._ars[j] - self._ars[i]) < 10:
                    Fd[i] = max(Fd[i], Fd[j] + 1)
                if maxd < Fi[i] or maxd < Fd[i]:
                    maxd = max(Fi[i], Fd[i])
                    vald = self._ars[i]

        if maxd <= N/2:
            vald = sum(self._ars) / N
        
        return round(vald * 10) / 10
