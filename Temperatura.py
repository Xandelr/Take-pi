import firebase_admin
from firebase_admin import credentials, db
from machine import I2C, Pin
from time import sleep
import bmp280

# Inicializa Firebase
cred = credentials.Certificate("C:\Users\cecer\Downloads\takepi-314-firebase-adminsdk-fbsvc-782a65dd10.json")  
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://takepi-314.firebaseio.com/'
})

# Inicializar I2C en GP0 (SDA) y GP1 (SCL)
i2c = I2C(0, sda=Pin(0), scl=Pin(1))

# Crear objeto del sensor
bmp = bmp280.BMP280(i2c)

while True:
    temperatura = bmp.get_temperature()
    print("Temperatura: {:.2f} °C".format(temperatura))

    # Subir la temperatura a Firebase
    ref = db.reference('pisos/piso3/temperatura') 
    ref.set(temperatura)

    sleep(60)  # Enviar cada 60 segundos (ajusta el intervalo según lo necesites)
