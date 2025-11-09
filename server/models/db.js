// server/models/db.js
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config({ path: "../server/.env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 🔹 Forzar codificación UTF-8 en cada conexión del pool
pool.on("connect", (client) => {
  client.query("SET client_encoding TO 'UTF8';").catch((err) =>
    console.error("Error al establecer codificación UTF-8:", err)
  );
});

pool
  .connect()
  .then(() => console.log("✅ Conectado a PostgreSQL (pool activo, UTF-8 forzado)"))
  .catch((err) => console.error("❌ Error de conexión a PostgreSQL:", err));

export default pool;
