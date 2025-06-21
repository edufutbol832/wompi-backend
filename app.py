from flask import Flask, request, jsonify
import hashlib

app = Flask(__name__)

# 🔐 Clave de integridad del entorno sandbox de Wompi
SECRET = "test_integrity_CxvWC5XqHUC8eownzkyCMKjfOujwVmqk"

@app.route('/')
def index():
    return 'Servidor Flask activo'

# 📬 Endpoint para generar la firma de integridad
@app.route('/generate-signature', methods=['POST'])
def generate_signature():
    data = request.get_json()

    amount = data.get('amount_in_cents')
    currency = data.get('currency')
    reference = data.get('reference')

    if not amount or not currency or not reference:
        return jsonify({"error": "Faltan parámetros"}), 400

    # 🔐 Concatenar en el orden: referencia + monto + moneda + llave privada
    cadena = f"{reference}{amount}{currency}{SECRET}"
    firma = hashlib.sha256(cadena.encode('utf-8')).hexdigest()

    return jsonify({"signature": firma})

if __name__ == '__main__':
    app.run()
