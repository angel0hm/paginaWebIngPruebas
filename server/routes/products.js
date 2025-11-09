// server/routes/products.js
import express from "express";
import pool from "../models/db.js"; // Usa el pool ya probado

const router = express.Router();

// --- Obtener todos los productos (sin paginación) ---
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY categoria, nombre;");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// --- Obtener productos por categoría ---
router.get("/categorias", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos ORDER BY categoria, nombre;");
    const productos = result.rows;

    const agrupados = productos.reduce((acc, prod) => {
      if (!acc[prod.categoria]) acc[prod.categoria] = [];
      acc[prod.categoria].push(prod);
      return acc;
    }, {});

    res.json(agrupados);
  } catch (error) {
    console.error("❌ Error al obtener productos por categoría:", error);
    res.status(500).json({ error: "Error al obtener productos por categoría" });
  }
});

// --- NUEVA: Obtener productos paginados ---
router.get("/paginated", async (req, res) => {
  try {
    const categoria = req.query.categoria || ""; // obtener categoría
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

    // contar total de productos de esa categoría
    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM productos WHERE categoria = $1",
      [categoria]
    );
    const total = parseInt(totalResult.rows[0].count);

    // obtener productos de esa categoría con paginación
    const result = await pool.query(
      "SELECT * FROM productos WHERE categoria = $1 ORDER BY nombre LIMIT $2 OFFSET $3",
      [categoria, limit, offset]
    );

    res.json({
      productos: result.rows,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("❌ Error al obtener productos paginados:", error);
    res.status(500).json({ error: "Error al obtener productos paginados" });
  }
});

export default router;
