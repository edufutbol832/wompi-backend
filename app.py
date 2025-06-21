from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib

app = Flask(__name__)
CORS(app)  # Esta línea habilita CORS para todas las rutas

SECRET = "test_integrity_CxvWC5XqHUC8eownzkyCMKjfOujwVmqk"

@app.route('/')
def index():
    return 'Servidor Flask activo'

@app.route('/generate-signature', methods=['POST'])
def generate_signature():
    data = request.get_json()
    amount = data.get('amount_in_cents')
    currency = data.get('currency')
    reference = data.get('reference')

    if not amount or not currency or not reference:
        return jsonify({"error": "Faltan parámetros"}), 400

    cadena = f"{reference}{amount}{currency}{SECRET}"
    firma = hashlib.sha256(cadena.encode('utf-8')).hexdigest()

    return jsonify({"signature": firma})

if __name__ == '__main__':
    app.run()
