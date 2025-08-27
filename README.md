# 📚 Biblioteca IFPI – Sistema de Empréstimos e Multas

## 🎯 Sobre o Projeto

Este é um sistema web desenvolvido com **Node.js** e **PostgreSQL** para gerenciar a biblioteca do campus IFPI Picos. O projeto permite o controle completo de usuários, livros, empréstimos, devoluções, multas por atraso e reservas. Também inclui um painel administrativo para bibliotecários.

## 📦 Estrutura do Projeto

| Pasta / Arquivo         | Descrição                                                  |
|--------------------------|-------------------------------------------------------------|
| `app.js`                 | Arquivo principal que inicializa o servidor Express         |
| `database/conexao.js`    | Configuração da conexão com o banco de dados PostgreSQL     |
| `database/estrutura.sql` | Script SQL para criação das tabelas do sistema              |
| `dao/usuarioDao.js`      | Acesso e manipulação de dados dos usuários                  |
| `dao/livroDao.js`        | Acesso e manipulação de dados dos livros                    |
| `dao/emprestimoDao.js`   | Lógica de empréstimos, devoluções e cálculo de multas       |
| `models/usuario.js`      | Modelo de dados do usuário                                  |
| `models/livro.js`        | Modelo de dados do livro                                    |
| `models/emprestimo.js`   | Modelo de dados do empréstimo                               |
| `scripts/testeFluxo.js`  | Script para testar o fluxo completo do sistema              |
| `scripts/importarSeed.js`| Script para importar dados iniciais (opcional)              |
| `seed.json`              | Arquivo com dados de exemplo para popular o banco           |
| `README.md`              | Documentação do projeto                                     |

## 🔧 Tecnologias Utilizadas

| Tecnologia       | Finalidade                                      |
|------------------|-------------------------------------------------|
| Node.js          | Backend e lógica de aplicação                   |
| Express          | Framework para rotas e servidor HTTP            |
| PostgreSQL       | Banco de dados relacional                       |
| bcrypt           | Criptografia de senhas                          |
| express-session  | Gerenciamento de sessões de usuário             |
| pg               | Driver oficial do PostgreSQL para Node.js       |

## 🧭 Funcionalidades

| Funcionalidade           | Descrição                                                                 |
|--------------------------|---------------------------------------------------------------------------|
| 👤 Cadastro de Usuários   | Registro de usuários com autenticação segura                             |
| 🛡️ Controle de Acesso     | Diferenciação entre usuários comuns e administradores                    |
| 📚 Gerenciamento de Livros| Cadastro, listagem e controle de disponibilidade                         |
| 📖 Empréstimos            | Registro de empréstimos com data e controle de devolução                 |
| ⏱️ Multas por Atraso      | Cálculo automático de multa com base na data de devolução                |
| 🧾 Registro de Multas     | Multas manuais registradas por administradores                           |
| 📌 Reservas               | Sistema de reservas para livros indisponíveis                            |
| 🧑‍💼 Painel Administrativo | Visualização e gestão de usuários, livros, reservas e multas             |

## 🚀 Acesso ao Projeto

<sub>*Este projeto roda localmente via Node.js. Em breve será disponibilizado online.*</sub>

## 🧑‍💻 Contribuidores

| Name            | Contact                            |
|------------------|-------------------------------------|
| Idelmar Junior   | idelmarjuniorre@gmail.com           |
| GitHub           | [IdelmarJr-dev](https://github.com/IdelmarJr-dev) |

| Name             | Contact
|------------------|-------------------------------------|
| Pedro Lucas      | pedrixlord@gmail.com                |
| GitHub           | [PedroLucasCortez](https://github.com/PedroLucasCortez)

## 📜 Licença

This project is licensed under All Rights Reserved.
