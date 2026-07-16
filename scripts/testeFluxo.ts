import "dotenv/config";
import { registrar } from "../dao/usuarioDao";
import { inserir } from "../dao/livroDao";
import {
  registrarEmprestimo,
  calcularMulta,
  registrarDevolucao,
} from "../dao/emprestimoDao";
import { query, end } from "../database/conexao";
import Usuario from "../models/usuario";
import Livro from "../models/livro";

(async () => {
  try {
    console.log("Registrando usuários...");
    const admin = new Usuario(
      null,
      "Bibliotecário",
      "admin@bib.com",
      "admin123"
    );
    const leitor = new Usuario(
      null,
      "Idelmar Junior",
      "idelmar@bib.com",
      "senha123"
    );

    const adminId = await registrar({ ...admin, is_admin: true });
    const leitorId = await registrar(leitor);
    console.log(`Admin ID: ${adminId}, Leitor ID: ${leitorId}`);

    try {
      const duplicado = new Usuario(
        null,
        "Idelmar Clone",
        "idelmar@bib.com",
        "senha456"
      );
      const id2 = await registrar(duplicado);
      console.log(
        `⚠️ Usuário duplicado registrado com ID ${id2} (isso não deveria acontecer!)`
      );
    } catch (err: any) {
      console.error(`Erro esperado: ${err.message}`);
    }

    console.log("\nCadastrando livros...");
    const livro1 = new Livro(null, "1984", "George Orwell", 1949);
    const livro2 = new Livro(
      null,
      "A Revolução dos Bichos",
      "George Orwell",
      1945
    );
    const livroId1 = await inserir(livro1);
    const livroId2 = await inserir(livro2);
    console.log(`Livros cadastrados: ${livroId1}, ${livroId2}`);

    console.log("\nAlugando livro...");
    await registrarEmprestimo(livroId1, leitorId);
    console.log(`Livro ${livroId1} alugado por usuário ${leitorId}`);

    console.log("\nSimulando atraso...");
    await query(
      `UPDATE emprestimos SET data_emprestimo = CURRENT_DATE - INTERVAL '10 days' WHERE livro_id = $1`,
      [livroId1]
    );

    const multa = await calcularMulta(livroId1);
    console.log(`Multa calculada: R$${multa}`);

    console.log("\nRegistrando multa manual...");
    await query(
      `INSERT INTO multas (usuario_id, valor, descricao, data_registro) VALUES ($1, $2, $3, CURRENT_DATE)`,
      [leitorId, multa, "Atraso na devolução do livro"]
    );
    console.log("Multa registrada");

    console.log("\nCriando reserva para livro indisponível...");
    await query(
      `INSERT INTO reservas (livro_id, usuario_id, data_reserva) VALUES ($1, $2, CURRENT_DATE)`,
      [livroId1, leitorId]
    );
    console.log("Reserva criada");

    console.log("\nDevolvendo livro...");
    await registrarDevolucao(livroId1);
    console.log(`Livro ${livroId1} devolvido`);

    console.log("\nTestes concluídos com sucesso!");
  } catch (err) {
    console.error("Erro durante os testes:", err);
  } finally {
    end();
  }
})();
