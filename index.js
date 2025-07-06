const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Obtener llave privada desde variables de entorno (Render)
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error('❌ ERROR: La variable PRIVATE_KEY no está definida.');
  process.exit(1);
}

// ✅ Middleware para permitir CORS (importante para el menú)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir desde cualquier origen
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Endpoint para generar firma
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
