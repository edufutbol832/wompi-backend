const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

// Configurar CORS para permitir solo tu frontend
app.use(cors({
  origin: "https://wompi-backend-nuevo.onrender.com",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());
app.use(express.static("public"));

// Ruta para generar firma simulada
app.post("/generate-signature", (req, res) => {
  const { amount_in_cents, currency, reference } = req.body;

  if (!amount_in_cents || !currency || !reference) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  // Aquí simulas la firma (en producción usarías tu clave privada y HMAC)
  const firmaSimulada = "firma_simulada_para_prueba";

  res.json({ signature: firmaSimulada });
});

// Redirección opcional después del pago
app.get("/redirect", (req, res) => {
  res.send("<h2>✅ ¡Pago procesado! Gracias por usar Wompi.</h2><a href='/menu.html'>Volver al menú</a>");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
});
