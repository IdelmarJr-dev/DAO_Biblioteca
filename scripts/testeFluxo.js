const usuarioDao = require("../dao/usuarioDao");
const livroDao = require("../dao/livroDao");
const emprestimoDao = require("../dao/emprestimoDao");
const pool = require("../database/conexao");
const usuario = require("../models/usuario");
const livro = require("../models/livro");

(async () => {
  try {
    console.log("🔐 Registrando usuários...");
    const admin = new usuario(
      null,
      "Bibliotecário",
      "admin@bib.com",
      "admin123"
    );
    const leitor = new usuario(
      null,
      "Idelmar Junior",
      "idelmar@bib.com",
      "senha123"
    );

    const adminId = await usuarioDao.registrar({ ...admin, is_admin: true });
    const leitorId = await usuarioDao.registrar(leitor);
    console.log(`Admin ID: ${adminId}, Leitor ID: ${leitorId}`);

    try {
      const duplicado = new Usuario(
        null,
        "Idelmar Clone",
        "idelmar@bib.com",
        "senha456"
      );
      const id2 = await UsuarioDAO.registrar(duplicado);
      console.log(
        `⚠️ Usuário duplicado registrado com ID ${id2} (isso não deveria acontecer!)`
      );
    } catch (err) {
      console.error(`Erro esperado: ${err.message}`);
    }

    console.log("\nCadastrando livros...");
    const livro1 = new livro(null, "1984", "George Orwell", 1949);
    const livro2 = new livro(
      null,
      "A Revolução dos Bichos",
      "George Orwell",
      1945
    );
    const livroId1 = await livroDao.inserir(livro1);
    const livroId2 = await livroDao.inserir(livro2);
    console.log(`Livros cadastrados: ${livroId1}, ${livroId2}`);

    console.log("\nAlugando livro...");
    await emprestimoDao.registrarEmprestimo(livroId1, leitorId);
    console.log(`Livro ${livroId1} alugado por usuário ${leitorId}`);

    console.log("\nSimulando atraso...");
    await pool.query(
      `UPDATE emprestimos SET data_emprestimo = CURRENT_DATE - INTERVAL '10 days' WHERE livro_id = $1`,
      [livroId1]
    );

    const multa = await emprestimoDao.calcularMulta(livroId1);
    console.log(`Multa calculada: R$${multa}`);

    console.log("\nRegistrando multa manual...");
    await pool.query(
      `INSERT INTO multas (usuario_id, valor, descricao, data_registro) VALUES ($1, $2, $3, CURRENT_DATE)`,
      [leitorId, multa, "Atraso na devolução do livro"]
    );
    console.log("Multa registrada");

    console.log("\nCriando reserva para livro indisponível...");
    await pool.query(
      `INSERT INTO reservas (livro_id, usuario_id, data_reserva) VALUES ($1, $2, CURRENT_DATE)`,
      [livroId1, leitorId]
    );
    console.log("Reserva criada");

    console.log("\nDevolvendo livro...");
    await emprestimoDao.registrarDevolucao(livroId1);
    console.log(`Livro ${livroId1} devolvido`);

    console.log("\nTestes concluídos com sucesso!");
  } catch (err) {
    console.error("Erro durante os testes:", err);
  } finally {
    pool.end();
  }
})();
