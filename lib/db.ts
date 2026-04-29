import 'server-only';
import mysql from 'mysql2/promise';

declare global {
  // eslint-disable-next-line no-var
  var __mysqlPool: mysql.Pool | undefined;
}

function createPool() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const database = process.env.DB_NAME;
  const password = process.env.DB_PASSWORD ?? '';
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

  if (!host || !user || !database) {
    throw new Error('Missing database env vars. Required: DB_HOST, DB_USER, DB_NAME');
  }
  if (!Number.isFinite(port)) {
    throw new Error('Invalid DB_PORT (must be a number)');
  }

  return mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
    dateStrings: true
  });
}

export const db: mysql.Pool = globalThis.__mysqlPool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__mysqlPool = db;
}
