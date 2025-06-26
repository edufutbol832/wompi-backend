const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Reemplaza esto con tu clave privada real de Wompi
const PRIVATE_KEY = 'tu_clave_privada_aqui';

app.post('/generate-signature', (req, res) => {
  const { amount_in_cents, currency, reference } = req.body;

  if (!amount_in_cents || !currency || !reference) {
    return res.status(400).json({ error: 'Faltan parámetros necesarios' });
  }

  // La fórmula para la firma: concatenar los valores separados por '|'
  const data = `${amount_in_cents}|${currency}|${reference}|${PRIVATE_KEY}`;

  // Crear el hash SHA256 de esa cadena
  const signature = crypto.createHash('sha256').update(data).digest('hex');

  // Devolver la firma al cliente
  res.json({ signature });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
