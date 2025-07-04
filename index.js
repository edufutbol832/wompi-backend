const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Carga segura de la llave privada desde variables de entorno
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error('❌ ERROR: La variable PRIVATE_KEY no está definida en el entorno.');
  process.exit(1); // Detiene la app si no hay clave configurada
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔁 Endpoint para generar firma SHA-256
app.post('/generate-signature', (req, res) => {
  const { amount_in_cents, currency, reference } = req.body;

  if (!amount_in_cents || !currency || !reference) {
    return res.status(400).json({ error: 'Faltan datos para generar la firma' });
  }

  const dataToSign = `${amount_in_cents}|${currency}|${reference}|${PRIVATE_KEY}`;
  const signature = crypto.createHash('sha256').update(dataToSign).digest('hex');

  res.json({ signature });
});

// 🔁 Redirección al finalizar el pago
app.get('/redirect', (req, res) => {
  const transactionId = req.query.id;
  res.redirect(`/respuesta.html?id=${transactionId}`);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
