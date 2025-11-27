import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on("connect", () => console.log("Conectado ao PostgreSQL com sucesso!"));
pool.on("error", err => console.error("Erro no Pool PostgreSQL:", err));

export default pool;