import type { ExecuteValues, RowDataPacket } from 'mysql2';
import { db } from './db';

export async function queryRows<T extends RowDataPacket>(sql: string, params: ExecuteValues = []) {
  const [rows] = await db.execute<T[]>(sql, params);
  return rows;
}

export async function queryOne<T extends RowDataPacket>(sql: string, params: ExecuteValues = []) {
  const rows = await queryRows<T>(sql, params);
  return rows[0] ?? null;
}
