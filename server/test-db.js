import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Conexión a PostgreSQL exitosa');
  } catch (err) {
    console.error('❌ Error de conexión:', err);
  } finally {
    await client.end();
  }
}

testConnection();
