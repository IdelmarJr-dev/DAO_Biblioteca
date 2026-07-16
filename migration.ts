import "dotenv/config";
import { Client } from "pg";
import { readFileSync } from "fs";

const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  throw new Error("DB_URL não definida no .env");
}

const dbName = new URL(dbUrl).pathname.replace(/^\//, "");

const rootUrl = new URL(dbUrl);
rootUrl.pathname = "/postgres";

const estruturaSQL = readFileSync("./database/estrutura.sql", "utf8");

async function runMigrations() {
  const client = new Client({ connectionString: rootUrl.toString() });

  try {
    await client.connect();

    const checkDb = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkDb.rows.length === 0) {
      console.log(`Banco de dados "${dbName}" não existe. Criando...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Banco "${dbName}" criado com sucesso!`);
    } else {
      console.log(`Banco "${dbName}" já existe.`);
    }

    await client.end();

    const dbClient = new Client({ connectionString: dbUrl });
    await dbClient.connect();

    console.log("Rodando migrações (criando tabelas se não existirem)...");
    await dbClient.query(estruturaSQL);

    console.log("Migrações concluídas com sucesso ✅");

    await dbClient.end();
  } catch (err) {
    console.error("Erro ao rodar migrações:", err);
    process.exit(1);
  }
}

runMigrations();
