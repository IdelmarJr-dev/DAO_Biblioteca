require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const livro = require("./models/livro");
const usuario = require("./models/usuario");
const livroDao = require("./dao/livroDao");
const usuarioDao = require("./dao/usuarioDao");
const emprestimoDao = require("./dao/emprestimoDao");
const reservaDao = require("./dao/reservaDao");
const Reserva = require("./models/reserva");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.listen(process.env.PORT || 3000, "0.0.0.0");
//Middleware para verificar se o usuário está logado
function autenticar(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: "Acesso negado. Faça login." });
  }
  next();
}

//Middleware para verificar se o usuário é administrador
function admin(req, res, next) {
  if (!req.session.usuario || !req.session.usuario.is_admin) {
    return res.status(403).json({ erro: "Acesso restrito ao administrador." });
  }
  next();
}

// Rota protegida para usuários logados
app.get("/livros", autenticar, async (req, res) => {
  const livros = await livroDao.listar();
  res.json(livros);
});

// Rota protegida para administradores
app.post("/livros", admin, async (req, res) => {
  const { titulo, autor, ano } = req.body;
  const livros = new livro(null, titulo, autor, ano);
  const id = await livroDao.inserir(livros);
  res.json({ id });
});

app.post("/registrar", async (req, res) => {
  const usuarios = new usuario(
    null,
    req.body.nome,
    req.body.email,
    req.body.senha
  );
  const id = await usuarioDao.registrar(usuarios);
  req.session.usuarioId = id;
  res.sendStatus(201);
});

app.post("/login", async (req, res) => {
  const usuario = await usuarioDao.autenticar(req.body.email, req.body.senha);
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
app.get("/reservas", admin, async (req, res) => {
  try {
    const reservas = await reservaDao.listarTodos();
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar reservas" });
  }
});

//Criar nova reserva (usuário logado)
app.post("/reservas", autenticar, async (req, res) => {
  try {
    const { livro_id } = req.body;
    const reserva = new Reserva(
      null,
      livro_id,
      req.session.usuario.id,
      new Date(),
      false
    );
    const id = await reservaDao.criar(reserva);
    res.json({ id });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar reserva" });
  }
});

//Atender reserva (admin)
app.put("/reservas/:id/atender", admin, async (req, res) => {
  try {
    const { id } = req.params;
    await reservaDao.atender(id);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atender reserva" });
  }
});

app.post("/livros", async (req, res) => {
  const livros = new livro(null, req.body.titulo, req.body.autor, req.body.ano);
  const id = await livroDao.inserir(livros);
  res.status(201).send({ id });
});

app.get("/livros", async (req, res) => {
  const livros = await livroDao.listar();
  res.send(livros);
});

app.put("/livros/:id/alugar", async (req, res) => {
  if (!req.session.usuarioId) return res.status(401).send("Não autenticado");
  await emprestimoDao.registrarEmprestimo(req.params.id, req.session.usuarioId);
  res.sendStatus(200);
});

app.put("/livros/:id/devolver", async (req, res) => {
  await emprestimoDao.registrarDevolucao(req.params.id);
  res.sendStatus(200);
});

app.get("/historico", async (req, res) => {
  if (!req.session.usuarioId) return res.status(401).send("Não autenticado");
  const historico = await emprestimoDao.listarPorUsuario(req.session.usuarioId);
  res.json(historico);
});

app.get("/admin/reservas", async (req, res) => {
  if (!req.session.usuarioId) return res.status(401).send("Não autenticado");
  const usuario = await usuarioDao.buscarPorId(req.session.usuarioId);
  if (!usuario.is_admin) return res.status(403).send("Acesso negado");

  const reservas = await reservaDao.listarTodos();
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
