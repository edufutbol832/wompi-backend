const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const generateSignature = require('./generate-signature');

dotenv.config();

const PORT = process.env.PORT || 10000;

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Ruta para generar la firma Wompi con logging para depuración
app.post('/generate-signature', (req, res) => {
  try {
    console.log('Cuerpo recibido:', req.body);
    const { amount_in_cents, currency, reference } = req.body;

    if (!amount_in_cents || !currency || !reference) {
      console.log('Faltan parámetros obligatorios');
      return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
    }

    if (!process.env.WOMPI_PRIVATE_KEY) {
      console.log('Clave privada no configurada');
      return res.status(500).json({ error: 'Clave privada no configurada' });
    }

    const signature = generateSignature({
      amount_in_cents,
      currency,
      reference,
      privateKey: process.env.WOMPI_PRIVATE_KEY
    });

    console.log('Firma generada:', signature);

    res.json({ signature });
  } catch (error) {
    console.error('Error en /generate-signature:', error);
    res.status(500).json({ error: 'Error generando firma' });
  }
});

// Puedes agregar otras rutas si tienes

app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en puerto ${PORT}`);
});
