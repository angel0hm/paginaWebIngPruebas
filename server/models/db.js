// server/models/db.js
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config({ path: "../server/.env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool
  .connect()
  .then(() => console.log("✅ Conectado a PostgreSQL (pool activo)"))
  .catch((err) => console.error("❌ Error de conexión a PostgreSQL:", err));

export default pool;
