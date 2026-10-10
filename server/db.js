import pg from "pg";
import fs from "node:fs/promises";

const { Pool } = pg;

// Connection settings come from environment variables (see .env.example)
export const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "library",
});

// Run a single query
export const query = (text, params) => pool.query(text, params);

// Run several queries inside one transaction
export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// Execute a whole .sql file (schema.sql, seed.sql, reset.sql)
export async function runSqlFile(path) {
  const sql = await fs.readFile(path, "utf8");
  await pool.query(sql);
}

export const closePool = () => pool.end();
