from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import hashlib
import os

app = Flask(__name__, static_url_path='', static_folder='.')
CORS(app)

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

# ✅ Servir archivos HTML estáticos como respuesta.html
@app.route('/<path:filename>')
def static_files(filename):
    return send_from_directory('.', filename)

if __name__ == '__main__':
    app.run()
