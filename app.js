const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");

const livro = require("./models/livro");
const usuario = require("./models/usuario");
const livroDao = require("./dao/livroDao");
const usuarioDao = require("./dao/usuarioDao");
const emprestimoDao = require("./dao/emprestimoDao");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  session({
    secret: "biblioteca-secreta",
    resave: false,
    saveUninitialized: false,
  })
);

app.post("/registrar", async (req, res) => {
  const usuario = new usuario(
    null,
    req.body.nome,
    req.body.email,
    req.body.senha
  );
  const id = await usuarioDao.registrar(usuario);
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

app.post("/livros", async (req, res) => {
  const livro = new livro(null, req.body.titulo, req.body.autor, req.body.ano);
  const id = await livroDao.inserir(livro);
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
  res.json;
});

app.get("/admin/reservas", async (req, res) => {
  if (!req.session.usuarioId) return res.status(401).send("Não autenticado");
  const usuario = await UsuarioDAO.buscarPorId(req.session.usuarioId);
  if (!usuario.is_admin) return res.status(403).send("Acesso negado");

  const reservas = await ReservaDAO.listarTodas();
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
