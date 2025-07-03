const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Tu clave privada Wompi - ¡recuerda reemplazarla por tu clave real!
const PRIVATE_KEY = 'prv_test_NTN6kv4XuC5i7Y3bWFRHVlQkBNRhIqvc';

app.post('/generate-signature', (req, res) => {
  const { amount_in_cents, currency, reference } = req.body;

  if (!amount_in_cents || !currency || !reference) {
    return res.status(400).json({ error: 'Faltan parámetros necesarios' });
  }

  // Concatenar datos con separador '|'
  const data = `${amount_in_cents}|${currency}|${reference}|${PRIVATE_KEY}`;

  // Crear hash SHA256
  const signature = crypto.createHash('sha256').update(data).digest('hex');

  // Log para verificar datos y firma generada
  console.log('✅ Firma generada:', signature);
  console.log('Datos recibidos para firma:', req.body);

  // Enviar firma al cliente
  res.json({ signature });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
