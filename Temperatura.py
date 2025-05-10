import network
import urequests
import gc
from machine import I2C, Pin
from time import sleep, time  # Aquí usamos time de MicroPython
import bmp280

# Configura tu conexión Wi-Fi
ssid = 'SOFIA Y GABO'
password = 'Berserk.'

# Establecer la conexión Wi-Fi
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)
while not wlan.isconnected():
    print("Conectando a WiFi...")
    sleep(1)

print("Conectado a WiFi, dirección IP:", wlan.ifconfig())

# Inicializa el sensor BMP280
i2c = I2C(0, sda=Pin(0), scl=Pin(1))
sensor = bmp280.BMP280(i2c)

# URL del Webhook de Google Apps Script (reemplaza por la tuya)
url = 'https://script.google.com/macros/s/AKfycbytW0EPL3Wu6CFKBd3ZnFUSHKGJn-ewMXMH86bdcOZxTmPlV-fdYHZ4gbPn4T2PBU-i8Q/exec'

# Función para enviar los datos a la hoja de Google
def enviar_datos(temperatura):
    try:
        # Enviar los datos (temperatura y fecha) al Webhook de Google Apps Script
        payload = {"temperatura": temperatura, "fecha": str(time())}  # Usamos time() de MicroPython
        response = urequests.post(url, json=payload)
        if response.status_code == 200:
            print("Datos enviados correctamente.")
        else:
            print("Error al enviar los datos:", response.status_code)
        response.close()
    except Exception as e:
        print("Error al enviar:", e)

# Función para verificar la memoria disponible
def check_memory():
    gc.collect()
    free_memory = gc.mem_free()
    print(f"Memoria libre: {free_memory} bytes")
    return free_memory

# Ciclo principal
while True:
    # Verifica la memoria disponible antes de intentar enviar los datos
    if check_memory() > 1024:  # Solo enviar si hay más de 1KB de memoria libre
        # Lee la temperatura
        temp = sensor.get_temperature()
        print("Temperatura:", temp)
        
        # Envía la temperatura a la hoja de Google
        enviar_datos(temp)
        
        # Espera un minuto antes de tomar la siguiente lectura
        sleep(60)
    else:
        print("Memoria insuficiente, esperando...")
        sleep(10)  # Espera un poco y vuelve a intentar
