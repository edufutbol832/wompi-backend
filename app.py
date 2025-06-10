from flask import Flask, jsonify
import hmac
import hashlib
from datetime import datetime
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Usamos una variable de entorno para proteger tu clave privada de Wompi
PRIVATE_KEY = os.environ.get("PRIVATE_KEY", "clave_por_defecto").encode()

@app.route("/generate_signature")
def generate_signature():
    amount_in_cents = "150000"
    currency = "COP"
    reference = f"pago-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    message = f"{amount_in_cents}{currency}{reference}"
    signature = hmac.new(PRIVATE_KEY, message.encode(), hashlib.sha256).hexdigest()

    return jsonify({
        "reference": reference,
        "signature": signature,
        "amountInCents": amount_in_cents,
        "currency": currency
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
