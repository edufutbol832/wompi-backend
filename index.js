const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Llave privada Wompi Sandbox directamente en el código
const PRIVATE_KEY = 'prv_test_v3_EEdDhvGkknF1i72Qh4NR4VKPmt6WUzaz'; // ← Esta es la llave privada de sandbox (real)

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔁 Generar firma para botón de pago
app.post('/generate-signature', (req, res) => {
  const { amount_in_cents, currency, reference } = req.body;

  if (!amount_in_cents || !currency || !reference) {
    return res.status(400).json({ error: 'Faltan datos para la firma' });
  }

  const dataToSign = `${amount_in_cents}|${currency}|${reference}|${PRIVATE_KEY}`;
  const signature = crypto.createHash('sha256').update(dataToSign).digest('hex');

  res.json({ signature });
});

// 🔁 Redirección luego del pago
app.get('/redirect', (req, res) => {
  const transactionId = req.query.id;
  res.redirect(`/respuesta.html?id=${transactionId}`);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
