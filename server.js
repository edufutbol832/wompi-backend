const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 10000;

// 👉 Encabezados de seguridad personalizados para CSP
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://checkout.wompi.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://translate.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://sandbox.wompi.co https://translate.googleapis.com;"
  );
  next();
});

// 👉 Servir archivos estáticos desde carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// 👉 Redirección luego del pago
app.get('/redirect', async (req, res) => {
  const transactionId = req.query.id;

  if (!transactionId) return res.redirect('/respuesta.html');

  try {
    const response = await fetch(`https://sandbox.wompi.co/v1/transactions/${transactionId}`);
    const data = await response.json();

    if (data && data.data) {
      const { status, reference, amount_in_cents, currency } = data.data;
      return res.redirect(`/respuesta.html?status=${status}&reference=${reference}&amount=${amount_in_cents}&currency=${currency}`);
    } else {
      return res.redirect('/respuesta.html');
    }
  } catch (error) {
    console.error('Error consultando transacción Wompi:', error);
    return res.redirect('/respuesta.html');
  }
});

// ✅ Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en puerto ${PORT}`);
});
