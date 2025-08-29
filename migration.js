const { Client } = require("pg");
const fs = require("fs");

const rootConfig = {
  user: "postgres",
  host: "localhost",
  password: "@Idel140211",
  port: 5432,
};

const dbName = "biblioteca";

const estruturaSQL = fs.readFileSync("./database/estrutura.sql", "utf8");

async function runMigrations() {
  const client = new Client(rootConfig);

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

    const dbClient = new Client({ ...rootConfig, database: dbName });
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
