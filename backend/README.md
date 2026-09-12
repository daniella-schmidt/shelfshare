# ShelfShare — Backend

API REST da **ShelfShare**, plataforma de troca de livros. Construída em **NestJS**
com **Prisma** sobre **PostgreSQL**.

Este diretório contém **apenas a API**. A interface fica em [`../frontend`](../frontend)
e a visão geral do projeto no [README raiz](../README.md).

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | NestJS 12 |
| Linguagem | TypeScript 6 |
| ORM | Prisma 7 com driver adapter `@prisma/adapter-pg` |
| Banco | PostgreSQL 14+ |
| Autenticação | JWT via Passport (`passport-jwt`) |
| Hash de senha | bcrypt |
| Validação | class-validator + class-transformer |

## Pré-requisitos

- **Node.js 20+** e **npm 10+**
- **PostgreSQL 14+** rodando localmente

## Como executar

```bash
cd backend
npm install
```

Crie o `.env` a partir do modelo e ajuste `DATABASE_URL` com o seu usuário e senha:

```bash
cp .env.example .env          # PowerShell: Copy-Item .env.example .env
```

Crie o banco no PostgreSQL e aplique as migrations:

```sql
CREATE DATABASE shelfshare;
```

```bash
npx prisma migrate dev
```

Isso aplica as migrations versionadas em `prisma/migrations`. A migration `init`
já existe no repositório; não a recrie com `--name init`.

Suba a API:

```bash
npm run start:dev
```

A API responde em **http://localhost:3001**.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run start:dev` | Sobe a API em modo watch |
| `npm run start` | Sobe a API sem watch |
| `npm run build` | Compila para `dist/` |
| `npm run start:prod` | Executa o build compilado |
| `npm run prisma:migrate` | Cria e aplica uma migration |
| `npm run prisma:generate` | Regera o client do Prisma |
| `npm run prisma:studio` | Abre o Prisma Studio para inspecionar o banco |

> `prisma generate` também roda automaticamente no `postinstall`. Sem ele os tipos
> do `@prisma/client` não existem e o build falha.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `DATABASE_URL` | sim | String de conexão do PostgreSQL |
| `JWT_SECRET` | sim | Segredo usado para assinar os tokens |
| `PORT` | não | Porta da API (padrão `3001`) |
| `FRONTEND_URL` | não | Origem liberada no CORS (padrão `http://localhost:5173`) |

O `.env` não é versionado; mantenha o `.env.example` atualizado quando adicionar
uma variável nova.

---

## Estrutura

```
backend/
├─ prisma/
│  ├─ schema.prisma        modelo de dados (User, Book, Trade)
│  ├─ constraints.sql      regras que o schema não expressa — ver abaixo
│  └─ migrations/          geradas pelo Prisma
├─ src/
│  ├─ main.ts              bootstrap: CORS, ValidationPipe, porta
│  ├─ app.module.ts        registra os cinco módulos
│  ├─ prisma/              PrismaService (@Global) — uma instância para o app
│  ├─ common/
│  │  ├─ guards/           JwtAuthGuard
│  │  ├─ decorators/       @CurrentUser()
│  │  └─ types/            AuthenticatedUser
│  └─ modules/
│     ├─ auth/             registro, login, JWT
│     ├─ users/            perfil do usuário logado
│     ├─ books/            estante do usuário (CRUD)
│     ├─ catalog/          busca pública de livros disponíveis
│     └─ trades/           propostas e fluxo de troca
├─ prisma.config.ts
├─ nest-cli.json
└─ tsconfig.json
```

Cada módulo segue o padrão do Nest: `*.module.ts`, `*.controller.ts`,
`*.service.ts` e uma pasta `dto/` quando recebe dados do cliente.

## Rotas

| Método | Rota | Acesso | Situação |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | público | implementado |
| `POST` | `/auth/login` | público | implementado |
| `GET` | `/users/me` | autenticado | implementado |
| `GET` | `/books/me` | autenticado | esqueleto |
| `POST` | `/books` | autenticado | esqueleto |
| `PATCH` | `/books/:id` | autenticado | esqueleto |
| `DELETE` | `/books/:id` | autenticado | esqueleto |
| `GET` | `/catalog` | público | esqueleto |
| `GET` | `/catalog/:id` | público | esqueleto |
| `POST` | `/trades` | autenticado | esqueleto |
| `GET` | `/trades/received` | autenticado | esqueleto |
| `GET` | `/trades/sent` | autenticado | esqueleto |
| `PATCH` | `/trades/:id/accept` | autenticado | esqueleto |
| `PATCH` | `/trades/:id/reject` | autenticado | esqueleto |
| `PATCH` | `/trades/:id/cancel` | autenticado | esqueleto |
| `PATCH` | `/trades/:id/confirm` | autenticado | esqueleto |

As rotas marcadas como **esqueleto** já existem, validam a entrada e exigem
autenticação, mas o service responde `501 Not Implemented`. A implementação
segue o roadmap do README raiz.

## Autenticação

`POST /auth/register` e `POST /auth/login` devolvem:

```json
{
  "access_token": "eyJhbGciOi...",
  "user": { "id": "...", "name": "...", "email": "...", "city": "...", "state": "SC" }
}
```

O cliente envia o token nas rotas protegidas:

```
Authorization: Bearer <access_token>
```

O `JwtStrategy` valida a assinatura e confirma que o usuário ainda existe no
banco; o resultado fica disponível via `@CurrentUser()`. O `passwordHash` nunca
sai em resposta alguma.

## Modelo de dados

Três entidades. O `status` de cada uma controla o fluxo:

```
Book   DISPONIVEL ──► RESERVADO ──► TROCADO

Trade  PENDENTE ──┬─► RECUSADA
                  ├─► CANCELADA
                  └─► ACEITA ──► CONCLUIDA
```

### `prisma/constraints.sql`

Três regras não são expressáveis no `schema.prisma` e foram acrescentadas à mão
na migration `init`:

1. `proposerId <> receiverId` — ninguém troca consigo mesmo
2. `offeredBookId <> requestedBookId` — os dois livros precisam ser diferentes
3. índice único **parcial** impedindo duas propostas `PENDENTE` idênticas

O cabeçalho do arquivo explica como repetir isso em migrations futuras. As três
são a última linha de defesa: o `TradesService` valida tudo antes e devolve erro
amigável.

### Ponto de atenção

Aceitar uma proposta reserva os dois livros **e** recusa as demais propostas
pendentes que disputavam qualquer um deles. É a única operação que altera
várias linhas de uma vez, então precisa rodar dentro de `prisma.$transaction`.
Sem isso, um erro no meio deixa livros reservados numa troca que nunca foi
aceita.

## Próximos passos

1. Implementar o `BooksService` — CRUD da estante (Feature 1)
2. Implementar o `CatalogService` — busca pública (Feature 2)
3. Implementar o `TradesService` — propostas e aceite transacional (Feature 3)
4. Implementar a confirmação em duas etapas (Feature 4)
5. Criar um seed com usuários e livros de exemplo
