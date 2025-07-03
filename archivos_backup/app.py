from flask import Flask, request, jsonify

app = Flask(__name__)

# Ejemplo de datos simulados de pagos, en producción debes consultar Wompi o tu base de datos
pagos_simulados = {
    "test123": {"status": "APPROVED"},
    "test456": {"status": "DECLINED"},
    # agrega más para pruebas si quieres
}

@app.route('/check-payment', methods=['GET'])
def check_payment():
    referencia = request.args.get('id')
    if not referencia:
        return jsonify({"error": "Falta el parámetro id"}), 400

    # Aquí deberías consultar la API de Wompi o base de datos para obtener el estado real del pago
    # Por ahora, usamos datos simulados para prueba
    estado_pago = pagos_simulados.get(referencia)

    if estado_pago:
        return jsonify(estado_pago)
    else:
        # Si no se encuentra la referencia, devolvemos estado no encontrado
        return jsonify({"status": "NOT_FOUND"}), 404


if __name__ == '__main__':
    app.run(debug=True)
