require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');  // <-- Importa cors

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para permitir CORS en todas las rutas
app.use(cors());

const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error('❌ ERROR: La variable PRIVATE_KEY no está definida.');
  process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-signature', (req, res) => {
  const { amount_in_cents, currency, reference } = req.body;

  if (!amount_in_cents || !currency || !reference) {
    return res.status(400).json({ error: 'Faltan datos para generar la firma' });
  }

  const signature = crypto
    .createHmac('sha256', PRIVATE_KEY)
    .update(`${amount_in_cents}|${currency}|${reference}`)
    .digest('hex');

  res.json({ signature });
});

app.get('/redirect', (req, res) => {
  const transactionId = req.query.id;
  if (!transactionId) {
    return res.redirect('/menu.html');
  }
  res.redirect(`/respuesta.html?id=${transactionId}`);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
