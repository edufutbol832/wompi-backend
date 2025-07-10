require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/generate-signature', (req, res) => {
  const { amount_in_cents, currency, reference } = req.body;
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    return res.status(500).json({ error: 'Clave privada no configurada' });
  }

  const signatureString = `${amount_in_cents}${currency}${reference}${privateKey}`;
  const hash = crypto.createHash('sha256').update(signatureString).digest('hex');

  res.json({ signature: hash });
});

module.exports = app;
