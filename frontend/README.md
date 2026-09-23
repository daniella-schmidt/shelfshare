# ShelfShare — Frontend

Interface web da **ShelfShare**, plataforma de troca de livros: o usuário cadastra os
livros que possui e deseja trocar, explora o acervo de outras pessoas, propõe trocas e
conversa com a outra parte até concluir a entrega.

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
| Build e dev server | Vite | 8 |
| Roteamento | React Router DOM | 7 |
| Cliente HTTP | Axios | 1 |
| Carrosséis | Swiper | 14 |
| Animação | GSAP | 3 |
| Scroll suave | Lenis | 1 |
| Lint | Oxlint | 1 |

O material da disciplina sugere Next.js. A equipe optou por **React + Vite**,
alternativa permitida no enunciado: a aplicação é uma SPA onde as telas principais
ficam atrás de login, e ali SSR e SEO não trazem ganho real. O backend segue a
sugestão — NestJS, Prisma e PostgreSQL.

## Pré-requisitos

- **Node.js 20+** e **npm 10+** (`node -v` para conferir)
- A API rodando em `http://localhost:3001` — veja [`../backend/README.md`](../backend/README.md)

## Como executar

```bash
cd frontend
npm install
```

Crie o arquivo de ambiente a partir do exemplo:

```bash
cp .env.example .env          # Linux / macOS / Git Bash
```

```powershell
Copy-Item .env.example .env   # Windows PowerShell
```

Suba a aplicação:

```bash
npm run dev
```

Ela abre em **http://localhost:5173**.

> No Windows, se o PowerShell recusar o `npm` com *"a execução de scripts foi
> desabilitada neste sistema"*, rode `Set-ExecutionPolicy -Scope CurrentUser
> -ExecutionPolicy RemoteSigned` e reabra o terminal.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Checa os tipos (`tsc -b`) e gera o build em `dist/` |
| `npm run preview` | Serve o conteúdo de `dist/` para validar o build |
| `npm run lint` | Roda o Oxlint no projeto |

## Variáveis de ambiente

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `VITE_API_URL` | não | `http://localhost:3001` | URL base da API NestJS |
| `VITE_GOOGLE_BOOKS_KEY` | não | — | Chave opcional do Google Books, usada na busca de livros |

Duas regras do Vite que valem lembrar:

1. Só variáveis com o prefixo **`VITE_`** chegam ao código da aplicação.
2. **Tudo que está numa variável `VITE_` vai para o bundle e fica visível no browser.**
   Nunca coloque senha ou segredo aqui — esses dados pertencem ao backend.

O `.env` está no `.gitignore`; o `.env.example` é versionado e serve de modelo.

---

## Estrutura de pastas

```
frontend/
├─ public/                      arquivos servidos como estão (favicon, ícones)
├─ src/
│  ├─ api/                      comunicação HTTP — sem estado, sem JSX
│  │  ├─ axios.ts               instância do axios, com os interceptors
│  │  ├─ auth.ts                /auth/register, /auth/login, /auth/me
│  │  ├─ books.ts               /books (estante) e /catalog (vitrine)
│  │  ├─ trades.ts              /trades, incluindo chat e resumo
│  │  └─ bookSearch.ts          busca em catálogos externos (ver abaixo)
│  ├─ contexts/                 estado global via Context API
│  │  ├─ AuthContext.tsx        usuário logado, entrar, cadastrar, sair
│  │  ├─ ChatContext.tsx        resumo de trocas e mensagens não lidas
│  │  └─ AccessibilityContext.tsx  preferências de acessibilidade da interface
│  ├─ controllers/              hooks que orquestram estado, loading e erro
│  │  └─ useBooks.ts            lista do catálogo
│  ├─ components/
│  │  ├─ common/                Header, Footer, ProtectedRoute, ChatDrawer,
│  │  │                         ChatTrigger, NotificationBell, AccessibilityMenu
│  │  ├─ books/                 BookCard, BookSearchInput
│  │  ├─ sections/              blocos da landing: Hero, Features, HowItWorks,
│  │  │                         BookSlider, TrustBar, FAQ, CTABanner
│  │  └─ trades/                ChatPanel — a conversa de uma troca
│  ├─ pages/                    uma tela por rota
│  ├─ types/index.ts            interfaces compartilhadas (Book, Trade, Message…)
│  ├─ App.tsx                   providers e definição das rotas
│  ├─ main.tsx                  ponto de entrada do React
│  └─ App.css / index.css       estilos globais
├─ index.html
└─ vite.config.ts
```

## Rotas

Definidas em [`src/App.tsx`](src/App.tsx):

| Rota | Página | Acesso |
| --- | --- | --- |
| `/` | `Home` — landing page | público |
| `/login` | `Login` | público |
| `/register` | `Register` | público |
| `/livros` | `Books` — catálogo com busca | público |
| `/livros/:id` | `BookDetail` — detalhe e proposta de troca | público (propor exige login) |
| `/minha-estante` | `Dashboard` — CRUD dos meus livros | **autenticado** |
| `/trocas` | `Trades` — propostas recebidas e enviadas | **autenticado** |

As duas últimas são embrulhadas pelo `ProtectedRoute`, que espera o `AuthContext`
carregar e redireciona para `/login` se não houver usuário.

## Autenticação

O `AuthContext` envolve a aplicação e expõe `user`, `loading`, `signIn`, `signUp` e
`signOut`.

- `signIn` e `signUp` chamam a API e guardam o `access_token` no `localStorage`, na
  chave **`shelfshare.token`**.
- O interceptor de requisição do axios anexa `Authorization: Bearer <token>` em toda
  chamada. O de resposta remove o token do `localStorage` se a API devolver **401**.
- Ao recarregar a página, o contexto revalida o token em **`GET /auth/me`**. Se falhar,
  o token é descartado.

Qualquer componente acessa o usuário logado com `const { user } = useAuth()`.

## Chat e notificações

O `ChatContext` consulta **`GET /trades/summary`** a cada **15 segundos** enquanto
houver usuário logado. Desse resumo saem:

- o contador do `NotificationBell` (propostas pendentes e mensagens não lidas);
- a lista de conversas ativas do `ChatDrawer`, aberto pelo `ChatTrigger`.

A conversa de uma troca fica no `ChatPanel`, que usa `GET` e `POST /trades/:id/messages`.
A atualização é por **polling**, não por WebSocket.

## Busca de livros em catálogos externos

Ao cadastrar um livro, o `BookSearchInput` preenche título, autor, capa e ISBN
automaticamente. O `api/bookSearch.ts` consulta **Open Library**, **Google Books** e
**BrasilAPI** em paralelo, com cache de 10 minutos, validação de dígito verificador do
ISBN e um prazo de 3,5 s que devolve resultados parciais em vez de travar a tela.

## Padrão de camadas

A separação pretendida é: `api/` faz HTTP puro, `controllers/` guarda estado e trata
erro, `pages/` e `components/` só apresentam.

> **Estado atual:** só a `Books.tsx` consome um controller (`useBooks`). As demais
> páginas chamam `booksApi` e `tradesApi` diretamente. Nenhum componente usa o axios
> sem passar pela camada `api/`. Vale padronizar isso numa próxima rodada.

## Próximos passos

1. Mover a lógica de estado de `Dashboard` e `Trades` para hooks em `controllers/`
2. Telas de redefinição de senha — as funções já existem em `api/auth.ts`, falta a rota no backend
3. Tela de edição de perfil consumindo `PUT /users/me`, que já existe no backend
4. Paginação no catálogo, que já é preparada no `catalogApi.list`
