from machine import I2C, Pin
from time import sleep
import bmp280

# Inicializar I2C en GP0 (SDA) y GP1 (SCL)
i2c = I2C(0, sda=Pin(0), scl=Pin(1))

# Crear objeto del sensor
bmp = bmp280.BMP280(i2c)

while True:
    temperatura = bmp.get_temperature()
    print("Temperatura: {:.2f} °C".format(temperatura))
    sleep(0.5)
