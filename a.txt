from flask import Flask, request, jsonify
from flask_cors import CORS
import hmac
import hashlib
import base64

app = Flask(__name__)
CORS(app)

# 🛠️ CAMBIA ESTA LÍNEA CON TU CLAVE PRIVADA DE PRUEBAS DE WOMPI (debe comenzar con 'prv_test_...')
PRIVATE_KEY = "prv_test_NTN6kv4XuC5i7Y3bWFRHVlQkBNRhIqvc"  # ← 🔁 REEMPLAZA AQUÍ CON TU CLAVE

@app.route("/")
def home():
    return "Servidor Flask activo"

@app.route("/webhook", methods=["POST"])
def webhook():
    received_signature = request.headers.get("X-Integrity-Signature")
    raw_body = request.get_data()

    if not received_signature:
        return jsonify({"error": "Firma no enviada"}), 400

    computed_signature = base64.b64encode(
        hmac.new(PRIVATE_KEY.encode(), raw_body, hashlib.sha256).digest()
    ).decode()

    if hmac.compare_digest(computed_signature, received_signature):
        print("✅ Firma válida. Webhook recibido correctamente.")
        return jsonify({"message": "Firma válida"}), 200
    else:
        print("❌ Firma inválida.")
        return jsonify({"error": "Firma inválida"}), 400

@app.route("/gracias")
def gracias():
    return "<h2>¡Gracias por tu pago!</h2>", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
