import firebase_admin
from firebase_admin import credentials, firestore
from machine import I2C, Pin
import bmp280
from time import sleep

# Inicializa Firebase Admin
cred = credentials.Certificate('/path/to/tu/archivo/credenciales.json')
firebase_admin.initialize_app(cred)

# Configura I2C
i2c = I2C(0, sda=Pin(0), scl=Pin(1))
bmp = bmp280.BMP280(i2c)

# Configura Firestore
db = firestore.client()

while True:
    # Obtén la temperatura
    temperatura = bmp.get_temperature()
    print("Temperatura: {:.2f} °C".format(temperatura))

    # Subir la temperatura a Firestore (piso2, mesa01)
    doc_ref = db.collection(u'mesas').document(u'piso2').collection(u'mesa01')
    doc_ref.update({
        u'temperatura': temperatura
    })
    
    # Espera 10 segundos antes de obtener una nueva temperatura
    sleep(10)
