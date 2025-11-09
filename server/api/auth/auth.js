// server/auth.js o donde manejes auth
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../../models/db.js"; // tu conexión a PostgreSQL

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE email=$1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, tipo_usuario: user.tipo_usuario },
      "TU_SECRETO_SUPER_SEGURO",
      { expiresIn: "8h" }
    );

    res.json({ token, usuario: { id: user.id, nombre: user.nombre, email: user.email, tipo_usuario: user.tipo_usuario } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

export default router;
