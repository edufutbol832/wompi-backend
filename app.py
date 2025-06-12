from flask import Flask, request, jsonify
import hashlib
import hmac
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Usa una variable de entorno (Render) o una clave por defecto para pruebas locales
SECRET_KEY = os.environ.get("WOMPI_SECRET_KEY", "sec_test_puede_ir_aqui_temporalmente")

@app.route('/')
def home():
    return "Backend Wompi activo"

@app.route('/webhook', methods=['POST'])
def webhook():
    received_signature = request.headers.get('X-Integrity')
    payload = request.get_data()

    expected_signature = hmac.new(
        key=SECRET_KEY.encode(),
        msg=payload,
        digestmod=hashlib.sha256
    ).hexdigest()

    if hmac.compare_digest(received_signature, expected_signature):
        print("✅ Firma válida - pago confirmado")
        return jsonify({"message": "OK"}), 200
    else:
        print("❌ Firma inválida - posible intento no autorizado")
        return jsonify({"message": "Firma no válida"}), 400

@app.route('/gracias')
def gracias():
    return "Gracias por tu pago (sandbox)", 200

if __name__ == '__main__':
    app.run()
