// index.js

require('dotenv').config(); // ✅ Carga las variables desde .env
const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Obtiene la llave privada desde .env
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error('❌ ERROR: La variable PRIVATE_KEY no está definida.');
  process.exit(1);
}

// ✅ Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Endpoint para generar firma
app.post('/generate-signature', (req, res) => {
  const { amount_in_cents, currency, reference } = req.body;

  if (!amount_in_cents || !currency || !reference) {
    return res.status(400).json({ error: 'Faltan datos para generar la firma' });
  }

  // 🔐 Firma usando HMAC-SHA256 como exige Wompi
  const signature = crypto
    .createHmac('sha256', PRIVATE_KEY)
    .update(`${amount_in_cents}|${currency}|${reference}`)
    .digest('hex');

  res.json({ signature });
});

// ✅ Redireccionar con ID de transacción
app.get('/redirect', (req, res) => {
  const transactionId = req.query.id;
  if (!transactionId) {
    return res.redirect('/menu.html');
  }
  res.redirect(`/respuesta.html?id=${transactionId}`);
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
