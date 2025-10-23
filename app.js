require("dotenv").config();
import express from "express";
import { json } from "body-parser";
import session from "express-session";

import livro from "./models/livro";
import usuario from "./models/usuario";
import { listar, inserir } from "./dao/livroDao";
import { registrar, autenticar, buscarPorId } from "./dao/usuarioDao";
import {
  registrarEmprestimo,
  registrarDevolucao,
  listarPorUsuario,
} from "./dao/emprestimoDao";
import { listarTodos, criar, atender } from "./dao/reservaDao";
import Reserva from "./models/reserva";

const app = express();
app.use(json());
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("Rodando...");
});

// Rota protegida para usuários logados
app.get("/livros", async (req, res) => {
  const livros = await listar();
  res.json(livros);
});

// Rota protegida para administradores
app.post("/livros", async (req, res) => {
  const { titulo, autor, ano } = req.body;
  const livros = new livro(null, titulo, autor, ano);
  const id = await inserir(livros);
  res.json({ id });
});

app.post("/registrar", async (req, res) => {
  const usuarios = new usuario(
    req.body.is_admin,
    req.body.nome,
    req.body.email,
    req.body.senha
  );
  const id = await registrar(usuarios);
  req.session.usuarioId = id;
  res.sendStatus(201);
});

app.post("/login", async (req, res) => {
  const usuario = await autenticar(req.body.email, req.body.senha);
  if (usuario) {
    req.session.usuarioId = usuario.id;
    res.sendStatus(200);
  } else {
    res.status(401).send("Credenciais inválidas");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
});

//Listar todas as reservas (admin)
app.get("/reservas", async (req, res) => {
  try {
    const reservas = await listarTodos();
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar reservas" });
  }
});

//Criar nova reserva (usuário logado)
app.post("/reservas", async (req, res) => {
  try {
    const { livro_id } = req.body;
    const reserva = new Reserva(
      null,
      livro_id,
      req.session.usuario.id,
      new Date(),
      false
    );
    const id = await criar(reserva);
    res.json({ id });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar reserva" });
  }
});

//Atender reserva (admin)
app.put("/reservas/:id/atender", async (req, res) => {
  try {
    const { id } = req.params;
    await atender(id);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atender reserva" });
  }
});

app.post("/livros", async (req, res) => {
  const livros = new livro(null, req.body.titulo, req.body.autor, req.body.ano);
  const id = await inserir(livros);
  res.status(201).send({ id });
});

app.get("/livros", async (req, res) => {
  const livros = await listar();
  res.send(livros);
});

app.put("/livros/:id/alugar", async (req, res) => {
  if (!req.session.usuarioId) return res.status(401).send("Não autenticado");
  await registrarEmprestimo(req.params.id, req.session.usuarioId);
  res.sendStatus(200);
});

app.put("/livros/:id/devolver", async (req, res) => {
  await registrarDevolucao(req.params.id);
  res.sendStatus(200);
});

app.get("/historico", async (req, res) => {
  if (!req.session.usuarioId) return res.status(401).send("Não autenticado");
  const historico = await listarPorUsuario(req.session.usuarioId);
  res.json(historico);
});

app.get("/admin/reservas", async (req, res) => {
  if (!req.session.usuarioId) return res.status(401).send("Não autenticado");
  const usuario = await buscarPorId(req.session.usuarioId);
  if (!usuario.is_admin) return res.status(403).send("Acesso negado");

  const reservas = await listarTodos();
  res.json(reservas);
});

app.post("/admin/multa", async (req, res) => {
  const { usuario_id, valor, descricao } = req.body;
  const hoje = new Date().toISOString().split("T")[0];
  await pool.query(
    `INSERT INTO multas (usuario_id, valor, descricao, data_registro) VALUES ($1, $2, $3, $4)`,
    [usuario_id, valor, descricao, hoje]
  );
  res.sendStatus(201);
});

app.post("/reservar/:livro_id", async (req, res) => {
  const hoje = new Date().toISOString().split("T")[0];
  await pool.query(
    `INSERT INTO reservas (livro_id, usuario_id, data_reserva) VALUES ($1, $2, $3)`,
    [req.params.livro_id, req.session.usuarioId, hoje]
  );
  res.sendStatus(201);
});

app.get("/status", (req, res) => {
  res.json({
    status: "online",
    projeto: "Sistema de Biblioteca",
    autor: "Idelmar Junior",
    hora: new Date().toLocaleString("pt-BR", { timeZone: "America/Fortaleza" }),
  });
});
app.get("/", (req, res) => {
  res.send(`
    <h1>Bem-vindo ao Sistema de Biblioteca IFPI</h1>
    <p>Este é o backend do projeto desenvolvido por <strong>Idelmar Junior e Pedro Lucas</strong>.</p>
    <p>Use as rotas como <code>/livros</code>, <code>/reservas</code>, <code>/login</code> para interagir com a API.</p>
    <p>Status do sistema: <a href="/status">/status</a></p>
  `);
});
