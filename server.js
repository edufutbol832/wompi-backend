require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');

const app = express();

// Usar el puerto asignado por Render o 3000 por defecto
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  console.error('❌ ERROR: La variable PRIVATE_KEY no está definida.');
  process.exit(1);
}

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

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});