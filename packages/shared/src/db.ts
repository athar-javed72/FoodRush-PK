import mysql from 'mysql2/promise';

const DATABASE_URL =
  process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/foodie';

let pool: mysql.Pool | null = null;

export async function connectDB(): Promise<mysql.Pool> {
  if (pool) return pool;
  pool = mysql.createPool(DATABASE_URL);
  await pool.getConnection();
  return pool;
}

export async function disconnectDB(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export function getPool(): mysql.Pool | null {
  return pool;
}
