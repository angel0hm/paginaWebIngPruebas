// server/routes/cart.js
import express from "express";
import pool from "../models/db.js";

const router = express.Router();

// Carrito temporal en memoria (después se puede asociar a usuario)
let cart = [];

// Obtener carrito
router.get("/", (req, res) => {
  res.json(cart);
});

// Agregar producto
router.post("/add", (req, res) => {
  const { id, nombre, precio, img, cantidad } = req.body;
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.cantidad += cantidad;
  } else {
    cart.push({ id, nombre, precio, img, cantidad });
  }
  res.json(cart);
});

// Eliminar producto
router.post("/remove", (req, res) => {
  const { id } = req.body;
  cart = cart.filter(item => item.id !== id);
  res.json(cart);
});

// Actualizar cantidad
router.post("/update", (req, res) => {
  const { id, cantidad } = req.body;
  const item = cart.find(i => i.id === id);
  if (item) item.cantidad = cantidad;
  res.json(cart);
});

export default router;
