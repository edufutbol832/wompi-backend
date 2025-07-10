const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;

// 👉 Permitir solicitudes desde cualquier origen (puedes restringirlo si lo deseas)
app.use(cors());

// 👉 Habilitar JSON en solicitudes
app.use(express.json());

// 👉 Ruta para verificar si el backend está vivo
app.get("/", (req, res) => {
  res.send("✅ Backend público Wompi en línea (modo Sandbox)");
});

// 👉 Ruta para generar firma (modo sandbox)
app.post("/generate-signature", (req, res) => {
  const { amount_in_cents, currency, reference } = req.body;

  // 🔐 Clave privada de pruebas de Wompi (sandbox)
  const secretKey = "prv_test_WWgF4lJNuUIoUEX2EpRsVr0rT66kPzL9";

  const payload = `${amount_in_cents}${currency}${reference}`;
  const crypto = require("crypto");
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(payload)
    .digest("hex");

  res.json({ signature });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
});
