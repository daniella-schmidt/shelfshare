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

Crie o `.env` a partir do modelo e ajuste a `DATABASE_URL` com o seu usuário e senha:

```bash
cp .env.example .env
```

No PowerShell, use `Copy-Item .env.example .env`. Troque apenas a senha na URL: o
início `postgresql://` é o protocolo e não muda.

Crie o banco e aplique as migrations:

```sql
CREATE DATABASE shelfshare;
```

```bash
npx prisma migrate dev
```

Isso aplica as migrations versionadas em `prisma/migrations`. Elas já existem no
repositório. Não as recrie com `--name`.

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

> **Depois de todo `git pull` que mexa no `schema.prisma`, rode `npx prisma generate`.**
> Ele roda sozinho no `npm install`, mas não roda num `git pull`. Sem isso, os modelos
> novos não existem nos tipos e o build quebra dizendo que a propriedade não existe no
> `PrismaService`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `DATABASE_URL` | sim | String de conexão do PostgreSQL |
| `JWT_SECRET` | sim | Segredo usado para assinar os tokens |
| `PORT` | não | Porta da API (padrão `3001`) |
| `FRONTEND_URL` | não | Origem liberada no CORS (padrão `http://localhost:5173`) |

O `.env` não é versionado; mantenha o `.env.example` atualizado ao adicionar uma
variável nova. Cada integrante gera o próprio `JWT_SECRET` com bytes aleatórios —
o comando está no README raiz.

## Prisma 7: 

- A URL do banco fica em `prisma.config.ts`, no bloco `datasource`.
- O `PrismaClient` recebe um **driver adapter** (`@prisma/adapter-pg`), criado em
  `src/prisma/prisma.service.ts`. Sem ele o client não conecta.
- O `prisma.config.ts` importa `dotenv/config` para carregar o `.env` antes de ler a
  `DATABASE_URL` — com um arquivo de config presente, o Prisma deixa de carregá-lo
  sozinho.

---

## Estrutura

```
backend/
├─ prisma/
│  ├─ schema.prisma        modelo de dados (User, Book, Trade, Message)
│  ├─ constraints.sql      regras que o schema não expressa — ver abaixo
│  └─ migrations/          histórico versionado do banco
├─ src/
│  ├─ main.ts              bootstrap: CORS, ValidationPipe, filtro de erros, porta
│  ├─ app.module.ts        registra os quatro módulos de feature
│  ├─ prisma/              PrismaService (@Global) — uma instância para o app
│  ├─ common/
│  │  ├─ guards/           JwtAuthGuard
│  │  ├─ decorators/       @CurrentUser()
│  │  ├─ filters/          PrismaExceptionFilter
│  │  └─ types/            AuthenticatedUser
│  └─ modules/
│     ├─ auth/             registro, login, JWT e leitura do perfil
│     ├─ users/            atualização do perfil
│     ├─ books/            estante do usuário (CRUD)
│     ├─ catalog/          busca pública de livros disponíveis
│     └─ trades/           propostas, fluxo de troca e chat
├─ prisma.config.ts
├─ nest-cli.json
└─ tsconfig.json
```

Cada módulo segue o padrão do Nest: `*.module.ts`, `*.controller.ts`, `*.service.ts` e
uma pasta `dto/` quando recebe dados do cliente.

## Rotas

Todas implementadas. As protegidas exigem `Authorization: Bearer <token>`.

| Método | Rota | Acesso | O que faz |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | público | Cria a conta e devolve o token |
| `POST` | `/auth/login` | público | Autentica e devolve o token |
| `GET` | `/auth/me` | autenticado | Perfil do usuário logado |
| `PUT` | `/users/me` | autenticado | Atualiza o perfil: nome, telefone, cidade e UF |
| `GET` | `/books/me` | autenticado | Livros da minha estante |
| `POST` | `/books` | autenticado | Cadastra um livro |
| `PATCH` | `/books/:id` | autenticado | Edita um livro meu |
| `DELETE` | `/books/:id` | autenticado | Remove um livro meu |
| `GET` | `/catalog` | público | Livros disponíveis (`?q=` e `?city=`) |
| `GET` | `/catalog/:id` | público | Detalhe de um livro disponível |
| `POST` | `/trades` | autenticado | Propõe uma troca |
| `GET` | `/trades/summary` | autenticado | Pendências e conversas ativas |
| `GET` | `/trades/received` | autenticado | Propostas que me fizeram |
| `GET` | `/trades/sent` | autenticado | Propostas que eu fiz |
| `GET` | `/trades/:id/messages` | autenticado | Mensagens da troca (marca como lidas) |
| `POST` | `/trades/:id/messages` | autenticado | Envia uma mensagem |
| `PATCH` | `/trades/:id/accept` | autenticado | Aceita — só o destinatário |
| `PATCH` | `/trades/:id/reject` | autenticado | Recusa — só o destinatário |
| `PATCH` | `/trades/:id/cancel` | autenticado | Cancela — só o proponente |
| `PATCH` | `/trades/:id/confirm` | autenticado | Confirma a conclusão |

## Autenticação

`POST /auth/register` e `POST /auth/login` devolvem:

```json
{
  "access_token": "eyJhbGciOi...",
  "user": { "id": "...", "name": "...", "email": "...", "city": "...", "state": "SC" }
}
```

O `JwtStrategy` valida a assinatura e confirma que o usuário ainda existe no banco; o
resultado fica disponível via `@CurrentUser()`. O token vale 7 dias e o `passwordHash`
nunca sai em resposta alguma.

## Perfil do usuário

A leitura do perfil é `GET /auth/me` e a escrita é `PUT /users/me`. Sendo um **PUT**,
ele substitui a representação inteira dos campos editáveis: `name`, `city` e `state`
são obrigatórios e **omitir `phone` apaga o telefone**.

`email` e `password` ficam de fora de propósito — trocar o e-mail mexe no login e na
restrição de unicidade, e a senha tem fluxo próprio. Enviar qualquer um dos dois
resulta em `400`, pela validação global. O id vem sempre do token: ninguém edita o
perfil de outra pessoa.

## Política de contato

E-mail e telefone das partes **só aparecem depois que a troca é aceita** — é o aceite
que libera o contato para combinarem a entrega. Enquanto a proposta está `PENDENTE`,
`RECUSADA` ou `CANCELADA`, as respostas trazem apenas `id`, `name`, `city` e `state`.

A regra vive num único lugar, o `applyContactPolicy` do `TradesService`, aplicado em
todas as rotas que devolvem uma troca. O `GET /trades/summary` nunca expõe contato:
ele monta um resumo só com nomes e títulos.

## Tratamento de erros

O `PrismaExceptionFilter`, registrado globalmente no `main.ts`, traduz os erros do
Prisma. Sem ele, qualquer violação de constraint no banco viraria **500**.

| Código | Vira | Exemplo |
| --- | --- | --- |
| `P2002` restrição única | **409** | Proposta repetida, e-mail já cadastrado |
| `P2025` registro inexistente | **404** | Update ou delete de algo que sumiu |
| `P2003` chave estrangeira | **409** | Remover algo ainda vinculado |
| `P2000` valor longo demais | **400** | Campo maior que a coluna |
| outros | 500 | Registra o código real no log |

Para as constraints conhecidas o filtro devolve uma mensagem específica. Como o índice
parcial de propostas foi criado em SQL puro e o Prisma não o conhece, o filtro procura
o nome da constraint também no texto do erro.

## Modelo de dados

Quatro entidades. O `status` de `Book` e `Trade` controla todo o fluxo:

| Entidade | Papel |
| --- | --- |
| `User` | dono de livros e participante de trocas |
| `Book` | um exemplar pertencente a um usuário |
| `Trade` | uma proposta entre dois usuários e dois livros |
| `Message` | uma mensagem do chat, sempre ligada a uma troca |

```
Book   DISPONIVEL ──► RESERVADO ──► TROCADO

Trade  PENDENTE ──┬─► RECUSADA
                  ├─► CANCELADA
                  └─► ACEITA ──► CONCLUIDA
```

O `User` também tem `passwordResetToken` e `passwordResetExpires`, criados pela
migration `add_password_reset`. **Ainda não há rota que os use** — ou a redefinição de
senha é implementada, ou as colunas devem ser removidas.

### `prisma/constraints.sql`

Três regras não são expressáveis no `schema.prisma` e foram acrescentadas à mão na
migration `init`:

1. `proposerId <> receiverId` — ninguém troca consigo mesmo
2. `offeredBookId <> requestedBookId` — os dois livros precisam ser diferentes
3. índice único **parcial** impedindo duas propostas `PENDENTE` idênticas

O cabeçalho do arquivo explica como repetir isso em migrations futuras: sempre
`--create-only`, editar o SQL e só então aplicar. **Nunca edite uma migration já
aplicada** — o Prisma guarda um checksum de cada uma e vai pedir para resetar o banco.

### Ponto de atenção

Aceitar uma proposta reserva os dois livros **e** recusa as demais propostas pendentes
que disputavam qualquer um deles. É a única operação que altera várias linhas de uma
vez, e por isso roda dentro de `prisma.$transaction`. Sem a transação, um erro no meio
deixaria livros reservados numa troca que nunca foi aceita.

## Próximos passos

1. Consolidar o perfil num lugar só: hoje a leitura está em `auth` e a escrita em
   `users`. Funciona, mas a simetria ajudaria quem consome a API
2. Decidir a redefinição de senha: implementar as rotas ou remover as colunas
3. Paginação em `GET /catalog`, que hoje devolve a lista inteira
4. Seed com usuários e livros de exemplo, para facilitar a demonstração
