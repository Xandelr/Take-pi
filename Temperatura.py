import urequests
import network
from machine import I2C, Pin
from time import sleep
import bmp280
import gc
import time

# Conexión Wi-Fi
ssid = 'SOFIA Y GABO'
password = 'Berserk.'

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)
while not wlan.isconnected():
    sleep(1)

print("Conectado a WiFi, dirección IP:", wlan.ifconfig())

# Inicializar BMP280
i2c = I2C(0, sda=Pin(0), scl=Pin(1))
sensor = bmp280.BMP280(i2c)

# Webhook de Google Sheets
url = 'https://script.google.com/macros/s/AKfycbxzfHsNl-DLwNCCgPF-mzDmTI3i9OTsrpTNCGTYPJMgGVXKCVbj4Imt_b7zFvvvIOfVog/exec'

while True:
    gc.collect()  # libera memoria
    temp = sensor.get_temperature()

    # Obtener la hora del dispositivo (hora local del microcontrolador)
    fecha = time.localtime()
    fecha_str = "{:02d}/{:02d}/{:04d} {:02d}:{:02d}:{:02d}".format(
        fecha[2], fecha[1], fecha[0], fecha[3], fecha[4], fecha[5]
    )

    print("Temperatura:", temp)
    print("Fecha:", fecha_str)

    try:
        response = urequests.post(url, json={
            "temperatura": temp,
            "fecha": fecha_str
        })
        print("Respuesta:", response.text)
        response.close()
    except Exception as e:
        print("Error al enviar los datos:", e)

    sleep(60)  # espera 1 minuto
