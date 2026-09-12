# ShelfShare — Frontend

Interface web da **ShelfShare**, plataforma de troca de livros: o usuário cadastra os
livros que possui e deseja trocar, explora o acervo de outras pessoas e propõe trocas.

Este diretório contém **apenas o frontend**. A API fica em [`../backend`](../backend)
e a visão geral do projeto no [README raiz](../README.md).

> **Time:** Error 404: Team not found — 3 integrantes
> **Disciplina:** Programação IV — Ciência da Computação — UNOESC — 2026/02

---

## Stack

| Camada | Tecnologia | Versão |
| --- | --- | --- |
| Biblioteca de UI | React | 19 |
| Linguagem | TypeScript | 6 |
| Build / dev server | Vite | 8 |
| Roteamento | React Router DOM | 7 |
| Cliente HTTP | Axios | 1 |
| Carrosséis | Swiper | 14 |
| Lint | Oxlint | 1 |

---

## Pré-requisitos

- **Node.js 20+** e **npm 10+** (`node -v` para conferir)
- A API rodando em `http://localhost:3001` — veja [`../backend/README.md`](../backend/README.md).
  Para trabalhar apenas nas telas estáticas, o backend não é obrigatório.

## Como executar

```bash
cd frontend
npm install
npm run dev
```

Antes do primeiro `npm run dev`, crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env      # Linux / macOS / Git Bash
```

```powershell
Copy-Item .env.example .env   # Windows PowerShell
```

A aplicação sobe em **http://localhost:5173**.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o servidor de desenvolvimento com hot reload |
| `npm run build` | Checa os tipos (`tsc -b`) e gera o build de produção em `dist/` |
| `npm run preview` | Serve localmente o conteúdo de `dist/` para validar o build |
| `npm run lint` | Roda o Oxlint em todo o projeto |

## Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `VITE_API_URL` | não | `http://localhost:3001` | URL base da API NestJS |

Duas regras do Vite que valem lembrar:

1. Só variáveis com o prefixo **`VITE_`** chegam ao código da aplicação.
2. **Tudo que está numa variável `VITE_` vai para o bundle e fica visível no browser.**
   Nunca coloque senha, chave de API ou segredo aqui — esses dados pertencem ao backend.

O `.env` está no `.gitignore`; o `.env.example` é versionado e serve de modelo.

---

## Estrutura de pastas

```
frontend/
├─ public/                 # arquivos servidos como estão (favicon, ícones, imagens)
├─ src/
│  ├─ api/                 # comunicação HTTP com o backend — sem estado, sem JSX
│  │  ├─ axios.ts          # instância do axios (baseURL + header Authorization)
│  │  ├─ auth.ts           # /auth/register, /auth/login
│  │  ├─ books.ts          # /books, /catalog
│  │  └─ trades.ts         # /trades
│  ├─ controllers/         # hooks que orquestram estado, loading e erro
│  │  ├─ useAuth.ts
│  │  ├─ useBooks.ts
│  │  └─ useTrades.ts
│  ├─ contexts/            # estado global via Context API
│  │  └─ AuthContext.tsx   # usuário logado, login, register, logout
│  ├─ components/          # componentes reutilizáveis
│  │  ├─ common/           # Header, Footer, Navbar
│  │  ├─ books/            # BookCard e afins
│  │  └─ sections/         # blocos da landing page
│  ├─ pages/               # uma tela por rota
│  ├─ types/               # interfaces compartilhadas (User, Book, Trade)
│  ├─ utils/               # funções auxiliares puras
│  ├─ App.tsx              # providers + definição das rotas
│  ├─ main.tsx             # ponto de entrada do React
│  ├─ App.css / index.css  # estilos globais
├─ index.html              # template HTML do Vite
└─ vite.config.ts
```

### Padrão de camadas

O projeto separa **acesso a dados**, **regra de tela** e **apresentação**. O sentido
das dependências é sempre de cima para baixo:

```
  pages/ · components/     apresentação — JSX, sem fetch e sem regra de negócio
         ▲
  controllers/             hooks — estado, loading, erro, orquestração
         ▲
  api/                     chamadas HTTP puras — recebem e devolvem dados
         ▲
  backend NestJS
```

Na prática, ao criar uma funcionalidade nova:

1. Adicione a função HTTP em `src/api/` (ex.: `getBooks()`).
2. Crie ou estenda o hook em `src/controllers/` para guardar o estado e tratar erro.
3. Consuma o hook na página ou componente.

Um componente **não chama o axios diretamente** — sempre passa pelo controller.
Isso mantém o JSX limpo e permite reaproveitar a mesma lógica em telas diferentes.

## Rotas

Definidas em [`src/App.tsx`](src/App.tsx):

| Rota | Página | Acesso |
| --- | --- | --- |
| `/` | `Home` — landing page | público |
| `/login` | `Login` | público |
| `/register` | `Register` | público |
| `/dashboard` | `Dashboard` — minha estante | autenticado |
| `/books/:id` | `BookDetail` — detalhe e proposta de troca | autenticado |

## Autenticação

O `AuthContext` envolve toda a aplicação e concentra o fluxo:

- `login()` e `register()` chamam a API, guardam o `access_token` no `localStorage`
  e passam a enviá-lo no header `Authorization: Bearer <token>`.
- Ao recarregar a página, o contexto tenta revalidar o token em `GET /users/me`;
  se falhar, o token é descartado.
- `logout()` limpa o `localStorage`, o header e o usuário em memória.

Qualquer componente acessa o usuário logado com `const { user } = useAuth()`.

---

## Estado atual

O esqueleto está montado e a landing page (`/`) já renderiza. Os arquivos abaixo
existem, mas ainda estão **vazios** e serão preenchidos nas próximas entregas:

- `src/api/auth.ts`, `src/api/books.ts`, `src/api/trades.ts`
- `src/controllers/useAuth.ts`, `src/controllers/useTrades.ts`
- `src/types/index.ts`
- `src/utils/helpers.ts`
- `src/components/books/BookCard.tsx`, `src/components/common/Navbar.tsx`

As páginas `Login`, `Register`, `Dashboard` e `BookDetail` são placeholders.

## Próximos passos

Acompanhados pelas Issues do repositório:

1. Definir as interfaces `User`, `Book` e `Trade` em `src/types/`.
2. Implementar `api/auth.ts` e `controllers/useAuth.ts`.
3. Construir os formulários de `Login` e `Register` ligados ao `AuthContext`.
4. Criar a rota protegida e montar o `Dashboard` (minha estante).
5. Implementar o CRUD de livros (`api/books.ts` + `BookCard`).
6. Implementar o fluxo de propostas de troca (`api/trades.ts` + `useTrades`).
