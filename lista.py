import os
import webbrowser
import pandas as pd
from itertools import combinations
from flask import Flask, request, send_file
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from threading import Timer

# ========== FLASK APP ==========
app = Flask(__name__)

# ========== CONFIGURACIÓN INICIAL ==========
# Leer archivo Excel
df = pd.read_excel("partidos.xlsx")

# Generar todas las combinaciones posibles de 6 partidos
partidos_indices = df.index.tolist()
combinaciones = list(combinations(partidos_indices, 6))

# Crear carpeta para PDFs si no existe
pdf_folder = "pdf_combinaciones"
os.makedirs(pdf_folder, exist_ok=True)

# ========== HTML EMBEBIDO ==========
html_form = """
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Generar Combinación</title>
</head>
<body>
    <h2>Generar PDF de Combinación</h2>
    <form action="/generar" method="post">
        <label for="combo_num">Número de Combinación (1-924):</label>
        <input type="number" id="combo_num" name="combo_num" min="1" max="924" required>
        <br><br>
        <button type="submit">Generar Combinación</button>
    </form>
</body>
</html>
"""

# ========== RUTAS FLASK ==========

@app.route('/')
def index():
    return html_form

@app.route('/generar', methods=['POST'])
def generar_pdf():
    try:
        combo_num = int(request.form['combo_num'])
    except ValueError:
        return "Número inválido. Debe ser un número entre 1 y 924."

    if not (1 <= combo_num <= len(combinaciones)):
        return f"El número debe estar entre 1 y {len(combinaciones)}."

    combo = combinaciones[combo_num - 1]
    pdf_path = os.path.join(pdf_folder, f"combinacion_{combo_num}.pdf")

    if not os.path.exists(pdf_path):
        columnas = ['FECHA', 'HORA', 'JOR', 'PAIS', 'PARTIDO', 'CUOTA']
        doc = SimpleDocTemplate(pdf_path, pagesize=letter)
        elementos = []
        styles = getSampleStyleSheet()

        # Título
        elementos.append(Paragraph(f"<b>Combinación #{combo_num}</b>", styles['Title']))
        elementos.append(Spacer(1, 12))

        # Tabla de partidos
        data = [columnas]
        for idx in combo:
            row = df.loc[idx]
            data.append([str(row[col]) for col in columnas])

        tabla = Table(data)
        tabla.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.yellow),
            ('BACKGROUND', (0, 1), (-1, -1), colors.whitesmoke),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))

        elementos.append(tabla)
        doc.build(elementos)

    return send_file(pdf_path, as_attachment=True)

# ========== ABRIR NAVEGADOR AUTOMÁTICAMENTE ==========
def abrir_navegador():
    webbrowser.open_new("http://localhost:5000")

# ========== EJECUTAR APP ==========
if __name__ == "__main__":
    print("Servidor iniciándose... Espere un momento.")
    Timer(1, abrir_navegador).start()  # Abrir navegador tras 1 segundo
    app.run(debug=False, port=5000)

