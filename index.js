const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir los archivos HTML desde la carpeta /public
app.use(express.static(path.join(__dirname, 'public')));

// Captura el parámetro id que Wompi envía tras redirección
app.get('/redirect', (req, res) => {
  const transactionId = req.query.id;
  if (transactionId) {
    res.redirect(`/respuesta.html?id=${transactionId}`);
  } else {
    res.redirect('/respuesta.html');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
});
