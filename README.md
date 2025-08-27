# DAO_Biblioteca
# 📚 Sistema de Biblioteca com Empréstimos e Multas

Este projeto é um sistema completo de gerenciamento de biblioteca, desenvolvido em Node.js com PostgreSQL. Ele permite o cadastro de usuários e livros, controle de empréstimos, cálculo automático de multas por atraso, reservas de livros e painel administrativo para bibliotecários.

---

## 🚀 Funcionalidades

- Cadastro e autenticação de usuários
- Diferenciação entre usuários comuns e administradores
- Cadastro e listagem de livros
- Empréstimo e devolução de livros
- Cálculo automático de multa por atraso
- Registro de multas manuais
- Sistema de reservas para livros indisponíveis
- Painel administrativo para bibliotecários

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- PostgreSQL
- bcrypt (criptografia de senhas)
- pg (driver PostgreSQL para Node)
- express-session (gerenciamento de sessões)

---

## 📦 Estrutura do Projeto

DAO_Biblioteca/
├── app.js
├── database/
│   ├── conexao.js
│   └── estrutura.sql
├── dao/
│   ├── usuarioDao.js
│   ├── livroDao.js
│   └── emprestimoDao.js
├── models/
│   ├── usuario.js
│   ├── livro.js
│   └── emprestimo.js
├── scripts/
│   ├── testeFluxo.js
│   └── importarSeed.js
├── seed.json
└── README.md

---

👨‍🏫 Painel Administrativo
Usuários com is_admin = true podem:
  -Visualizar todas as reservas
  -Registrar multas manuais
  -Gerenciar livros e usuários
  

---

📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

Desenvolvido por: 
  -Idelmar Júnior de Matos Cunha 
  -Pedro Lucas Pereira de Sousa Cortez
  

  ✉️ Contato
    idelmarjuniorre@gmail.com
    pedrixlord@gmail.com
  
📍 Picos – PI, Brasil
