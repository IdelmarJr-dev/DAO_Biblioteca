import { Pool, QueryResultRow } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export const query = <T extends QueryResultRow = any>(
  text: string,
  params?: any[]
) => pool.query<T>(text, params);

export const end = () => pool.end();
