from flask import Flask, request, jsonify
import hashlib

app = Flask(__name__)

# 🔐 Secreto de integridad proporcionado por Wompi (modo sandbox)
SECRET = "test_integrity_CxvWC5XqHUC8eownzkyCMKjfOujwVmqk"

@app.route('/')
def index():
    return 'Servidor Flask activo'

# 🚀 Endpoint para generar la firma SHA256
@app.route('/generate-signature', methods=['POST'])
def generate_signature():
    data = request.get_json()

    # ⚠️ Validamos que todos los datos estén presentes
    amount = data.get('amount_in_cents')
    currency = data.get('currency')
    reference = data.get('reference')

    if not amount or not currency or not reference:
        return jsonify({"error": "Faltan parámetros"}), 400

    # 🧮 Concatenación en orden requerido por Wompi
    cadena = f"{reference}{amount}{currency}{SECRET}"

    # 🔐 Firma con SHA256
    firma = hashlib.sha256(cadena.encode('utf-8')).hexdigest()

    # 🟢 Devolvemos la firma como JSON
    return jsonify({"signature": firma})

# 🔧 Solo para pruebas locales
if __name__ == '__main__':
    app.run()
