-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Tabela de livros
CREATE TABLE IF NOT EXISTS livros (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  autor TEXT NOT NULL,
  ano_de_publicacao INTEGER,
  disponivel BOOLEAN DEFAULT TRUE
);

-- Tabela de empréstimos
CREATE TABLE IF NOT EXISTS emprestimos (
  id SERIAL PRIMARY KEY,
  livro_id INTEGER REFERENCES livros(id),
  usuario_id INTEGER REFERENCES usuarios(id),
  data_emprestimo DATE NOT NULL,
  data_devolucao DATE,
  multa DECIMAL DEFAULT 0
);

-- Tabela de reservas
CREATE TABLE IF NOT EXISTS reservas (
  id SERIAL PRIMARY KEY,
  livro_id INTEGER REFERENCES livros(id),
  usuario_id INTEGER REFERENCES usuarios(id),
  data_reserva DATE NOT NULL,
  atendida BOOLEAN DEFAULT FALSE
);

-- Tabela de multas registradas
CREATE TABLE IF NOT EXISTS multas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  valor DECIMAL NOT NULL,
  descricao TEXT,
  paga BOOLEAN DEFAULT FALSE,
  data_registro DATE NOT NULL
);
