import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../models/db.js";

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, tipo_usuario, fecha_registro)
       VALUES ($1, $2, $3, $4, NOW()) RETURNING id, nombre, email, tipo_usuario`,
      [nombre, email, hashedPassword, "user"]
    );
    res.json({ mensaje: "Usuario registrado", usuario: result.rows[0] });
  } catch (err) {
    console.error(err);
    if (err.code === "23505") return res.status(400).json({ error: "Email ya registrado" });
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (!result.rows.length) return res.status(401).json({ error: "Usuario no encontrado" });
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });
    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, tipo_usuario: user.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ mensaje: "Login exitoso", token, usuario: { id: user.id, nombre: user.nombre, email: user.email, tipo_usuario: user.tipo_usuario } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

export default router;
