// server/routes/checkout.js
import express from "express";
import pool from "../models/db.js"; // si quieres guardar pedidos

const router = express.Router();

// Crear pedido / iniciar checkout
router.post("/", async (req, res) => {
  const { carrito, metodoPago, usuario } = req.body;

  if (!carrito || carrito.length === 0) {
    return res.status(400).json({ error: "Carrito vacío" });
  }

  // Calcular total
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  // Aquí podrías guardar el pedido en la DB
  // const result = await pool.query("INSERT INTO pedidos ...");

  if (metodoPago === "paypal") {
    // Aquí podrías generar un link de PayPal usando su SDK o API
    return res.json({ mensaje: "Redirigir a PayPal", total });
  } else if (metodoPago === "banco") {
    // Aquí devuelves datos para transferencia bancaria o pago con tarjeta
    return res.json({ mensaje: "Mostrar instrucciones de pago bancario", total });
  } else {
    return res.status(400).json({ error: "Método de pago inválido" });
  }
});

export default router;
