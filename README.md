# ShelfShare

Plataforma web de troca de livros. O usuário cadastra os livros que possui e deseja
trocar, explora o acervo de outras pessoas e propõe trocas — "meu livro X pelo seu
livro Y". Quando as duas partes aceitam, os contatos são liberados para combinarem
a entrega.

Projeto final da disciplina de **Programação IV** — Ciência da Computação — UNOESC — 2026/02
Professor: Roberson Junior Fernandes Alves

---

## Time

**Error 404: Team not found** — 3 integrantes

| Integrante | GitHub | Responsabilidade |
| --- | --- | --- |
| Daniella Schmidt | [@daniella-schmidt] | Front-end - Next.js: telas de login/cadastro/estante, formulário, consumo da API |
| Yuliangel Herrera | [@Yuliangel-Herrera] | models + auth + users no back-end: cadastro, login, hash de senha, JWT, guard |
| Leandra | _a preencher_ | books no back-end: CRUD da estante, validação de dono, DTOs |

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Frontend | React 19 + TypeScript + Vite |
| Roteamento | React Router DOM 7 |
| Cliente HTTP | Axios |
| Backend | NestJS + TypeScript |
| Autenticação | JWT (Passport) + bcrypt |
| ORM | Prisma 7 |
| Banco de dados | PostgreSQL |

---

## Estrutura do repositório

```
shelfshare/
├─ frontend/            aplicação React + Vite
│  ├─ src/
│  │  ├─ api/           chamadas HTTP ao backend
│  │  ├─ controllers/   hooks com estado e regra de tela
│  │  ├─ contexts/      estado global (autenticação)
│  │  ├─ components/    componentes reutilizáveis
│  │  ├─ pages/         uma tela por rota
│  │  ├─ types/         interfaces compartilhadas
│  │  └─ utils/         funções auxiliares
│  ├─ .env.example
│  └─ README.md         documentação detalhada do frontend
├─ backend/             API NestJS
│  ├─ prisma/           schema e migrations
│  ├─ src/
│  │  ├─ common/        guards, decorators, filtros
│  │  └─ modules/       auth, users, books, catalog, trades
│  ├─ .env.example
│  └─ README.md         documentação detalhada do backend
├─ .gitignore
└─ README.md
```

---

## Pré-requisitos

- **Node.js 20+** e **npm 10+**
- **PostgreSQL 14+** rodando localmente (ou via Docker)
- **Git**

## Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/daniella-schmidt/shelfshare.git
cd shelfshare
```

### 2. Banco de dados

Crie o banco no PostgreSQL:

```sql
CREATE DATABASE shelfshare;
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Ajuste `DATABASE_URL` no `.env` com o seu usuário e senha do PostgreSQL. Em seguida,
aplique as migrations e suba a API:

```bash
npx prisma migrate dev
npm run start:dev
```

A API responde em **http://localhost:3001**.

### 4. Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A aplicação abre em **http://localhost:5173**.

> No Windows PowerShell, troque `cp` por `Copy-Item`.

## Variáveis de ambiente

| Arquivo | Variável | Descrição |
| --- | --- | --- |
| `backend/.env` | `DATABASE_URL` | String de conexão do PostgreSQL |
| `backend/.env` | `JWT_SECRET` | Segredo usado para assinar os tokens |
| `backend/.env` | `PORT` | Porta da API (padrão `3001`) |
| `frontend/.env` | `VITE_API_URL` | URL base da API (padrão `http://localhost:3001`) |

Os arquivos `.env` **não são versionados**. Cada `.env.example` serve de modelo e deve
ser mantido atualizado quando uma variável nova for adicionada.

---

## Escopo do MVP

### Incluído

- Cadastro e login de usuário
- Minha estante: cadastrar, editar e remover os próprios livros
- Explorar e buscar livros disponíveis de outras pessoas
- Propor troca oferecendo um livro próprio por um livro de outro usuário
- Aceitar, recusar ou cancelar uma proposta
- Concluir a troca, liberando o contato entre as partes

### Fora do MVP

Chat em tempo real, avaliação e reputação de usuários, frete e pagamento, lista de
desejos com match automático, notificações por e-mail, painel administrativo e
integração com APIs externas de catálogo de livros.

## Modelo de dados

Três entidades. O `status` de cada uma controla todo o fluxo do sistema.

| Entidade | Papel |
| --- | --- |
| `User` | quem usa o sistema — dono de livros e participante de trocas |
| `Book` | um exemplar pertencente a um usuário |
| `Trade` | uma proposta de troca entre dois usuários e dois livros |

```
Book   DISPONIVEL ──► RESERVADO ──► TROCADO

Trade  PENDENTE ──┬─► RECUSADA
                  ├─► CANCELADA
                  └─► ACEITA ──► CONCLUIDA
```

Aceitar uma proposta reserva os dois livros e recusa automaticamente as demais
propostas pendentes que disputavam qualquer um deles — tudo dentro de uma transação.

## Fluxo da aplicação

1. O usuário se cadastra e faz login.
2. Adiciona à sua estante os livros que quer trocar.
3. Explora o acervo e encontra um livro de interesse.
4. Propõe a troca, escolhendo qual dos seus livros vai oferecer.
5. O dono do livro solicitado aceita ou recusa.
6. Com o aceite, os contatos são liberados e a entrega é combinada fora da plataforma.
7. Ambos confirmam, a troca é concluída e os livros saem do catálogo.
