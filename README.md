# ShelfShare

Plataforma web de troca de livros. O usuário cadastra os livros que possui e deseja
trocar, explora o acervo de outras pessoas e propõe trocas — "meu livro X pelo seu
livro Y". Quando as duas partes aceitam, os contatos são liberados para combinarem
a entrega.

Projeto final da disciplina de **Programação IV** — Ciência da Computação — UNOESC — 2026/02
Professor: Roberson Junior Fernandes Alves

---

## Aplicação online

| | |
| --- | --- |
| Website | https://shelfshare-tan.vercel.app |
| API | https://shelfshare-tan.vercel.app/api |
| Vídeo de apresentação | a publicar |
| Repositório | https://github.com/daniella-schmidt/shelfshare |

O deploy foi feito na **Vercel**, com frontend e backend sob o mesmo domínio: o
backend é exposto em `/api` por meio de rewrites definidos no `vercel.json` da
raiz. O banco PostgreSQL está hospedado no **Supabase**, com connection pooling
para se adaptar ao ambiente serverless.

> Substitua o campo "Vídeo de apresentação" pelo link do YouTube assim que o
> vídeo estiver publicado (pode ser como não listado).

---

## Time

**Error 404: Team not found** — 3 integrantes

| Integrante | GitHub | Responsabilidade |
| --- | --- | --- |
| Daniella Schmidt | [@daniella-schmidt](https://github.com/daniella-schmidt) | Front-end: telas, componentes, chat e consumo da API |
| Yuliangel Herrera | [@Yuliangel-Herrera](https://github.com/Yuliangel-Herrera) | Back-end: modelagem de dados, autenticação (JWT, bcrypt) e guards |
| Leandra de Oliveira | [@Leandra-Oliveira](https://github.com/Leandra-Oliveira) | Back-end: CRUD da estante, validação de dono e DTOs |

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
| Banco de dados | PostgreSQL (Supabase) |
| Deploy | Vercel (frontend + backend) |

---

## Estrutura do repositório
```
shelfshare/
├─ frontend/            aplicação React + Vite
│  ├─ src/
│  │  ├─ api/           chamadas HTTP ao backend
│  │  ├─ controllers/   hooks com estado e regra de tela
│  │  ├─ contexts/      estado global (autenticação, chat, acessibilidade)
│  │  ├─ components/    componentes reutilizáveis
│  │  ├─ pages/         uma tela por rota
│  │  └─ types/         interfaces compartilhadas
│  ├─ .env.example
│  └─ README.md         documentação detalhada do frontend
├─ backend/             API NestJS
│  ├─ prisma/           schema e migrations
│  ├─ src/
│  │  ├─ common/        guards, decorators, filtros de erro
│  │  └─ modules/       auth, users, books, catalog, trades
│  ├─ .env.example
│  └─ README.md         documentação detalhada do backend
├─ vercel.json          configuração dos dois serviços na Vercel
├─ .gitignore
└─ README.md
```

Documentação detalhada de cada parte: [frontend](frontend/README.md) e
[backend](backend/README.md) — incluindo rotas, variáveis de ambiente e o
registro das decisões técnicas (como a escolha de React + Vite).

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

Ajuste `DATABASE_URL` no `.env` com o seu usuário e senha do PostgreSQL. Em
seguida, aplique as migrations e suba a API:

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

---

## Variáveis de ambiente

| Arquivo | Variável | Descrição |
| --- | --- | --- |
| `backend/.env` | `DATABASE_URL` | String de conexão do PostgreSQL |
| `backend/.env` | `DIRECT_URL` | Conexão direta (apenas para migrations do Prisma) |
| `backend/.env` | `JWT_SECRET` | Segredo usado para assinar os tokens |
| `backend/.env` | `PORT` | Porta da API (padrão `3001`) |
| `backend/.env` | `FRONTEND_URL` | Origem liberada no CORS (padrão `http://localhost:5173`) |
| `frontend/.env` | `VITE_API_URL` | URL base da API (padrão `http://localhost:3001`) |

Os arquivos `.env` não são versionados. Cada `.env.example` serve de modelo e
deve ser mantido atualizado quando uma variável nova for adicionada.

---

## Escopo do MVP

### Entregue

- [x] Cadastro e login de usuário (JWT + bcrypt)
- [x] Minha estante: cadastrar, editar e remover os próprios livros (CRUD completo)
- [x] Explorar e buscar livros disponíveis de outras pessoas
- [x] Preencher os dados do livro buscando em catálogos externos por título ou ISBN
- [x] Propor troca oferecendo um livro próprio por um livro de outro usuário
- [x] Aceitar, recusar ou cancelar uma proposta
- [x] Conversar com a outra parte pelo chat da própria troca
- [x] Concluir a troca, liberando o contato entre as partes
- [x] Deploy funcional (frontend + backend + banco)

### Fora do MVP

Avaliação e reputação de usuários, frete e pagamento, lista de desejos com match
automático, notificações por e-mail, painel administrativo e redefinição de senha.

> O **chat** entrou no escopo durante o desenvolvimento, por ser essencial para as
> partes combinarem a entrega. As mensagens ficam dentro da própria proposta e a
> tela se atualiza por polling a cada 15 segundos.

---

## Modelo de dados

Quatro entidades. O `status` de `Book` e `Trade` controla todo o fluxo do sistema.

| Entidade | Papel |
| --- | --- |
| `User` | quem usa o sistema — dono de livros e participante de trocas |
| `Book` | um exemplar pertencente a um usuário |
| `Trade` | uma proposta de troca entre dois usuários e dois livros |
| `Message` | uma mensagem do chat, sempre ligada a uma troca |

```
Book   DISPONIVEL ──► RESERVADO ──► TROCADO

Trade  PENDENTE ──┬─► RECUSADA
                  ├─► CANCELADA
                  └─► ACEITA ──► CONCLUIDA
```

Aceitar uma proposta reserva os dois livros e recusa automaticamente as demais
propostas pendentes que disputavam qualquer um deles — tudo dentro de uma
transação, para garantir consistência.

---

## Fluxo da aplicação

1. O usuário se cadastra e faz login.
2. Adiciona à sua estante os livros que quer trocar.
3. Explora o acervo e encontra um livro de interesse.
4. Propõe a troca, escolhendo qual dos seus livros vai oferecer.
5. O dono do livro solicitado aceita ou recusa.
6. Com o aceite, os contatos são liberados e a entrega é combinada pelo chat da troca.
7. Ambos confirmam, a troca é concluída e os livros saem do catálogo.

---

## Decisões técnicas

- **React + Vite** no frontend: build rápido, HMR ágil e tipagem com TypeScript.
  A escolha está registrada em detalhe no [frontend/README.md](frontend/README.md).
- **NestJS** no backend: arquitetura modular que separa `auth`, `users`, `books`,
  `catalog` e `trades`, com DTOs, guards e filtros de erro.
- **Prisma 7 + PostgreSQL (Supabase)**: modelagem declarativa e migrations
  versionadas. O Supabase foi escolhido por oferecer PostgreSQL gerenciado com
  connection pooling, essencial para o ambiente serverless da Vercel.
- **JWT + bcrypt**: autenticação stateless com senha hasheada, sem sessão no
  servidor.
- **Vercel com dois serviços**: frontend e backend no mesmo domínio, o que
  simplifica CORS e reduz custo operacional.
```
