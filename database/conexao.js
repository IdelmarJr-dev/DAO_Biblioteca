import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "biblioteca",
  password: "@Idel140211",
  port: 5432,
});

export const query = (text, params) => pool.query(text, params);
export const end = () => pool.end();
