@AGENTS.md

# Frontend — Origem

Stack da disciplina: Next.js 16 (App Router), React 19, TypeScript, Chakra UI v3, Tailwind, Zustand e axios (requisições, como na aula de Integração com APIs). Nada além disso sem perguntar.

## Comandos (dentro de `frontend/`)
- `npm run dev` — servidor local
- `npm run build` — build de produção; rode antes de dar a tarefa por concluída
- `npm run lint` — ESLint
- `npm test` — testes unitários (Jest, em `tests/`); `npm run test:coverage` mostra a cobertura
- `npm run typegen` — regenera os tipos do tema do Chakra; rode depois de mudar `src/theme/`

## Testes
- Ficam em `tests/`, espelhando `src/` (`tests/store/`, `tests/utils/`), com dados de exemplo em `tests/helpers/fixtures.ts` (peças e usuários do seed).
- Rodam no Node, sem navegador (`testEnvironment: "node"`); o `tests/setup-env.ts` cria um `localStorage` em memória para o `persist` do carrinho.
- Teste de caso do plano de testes: o `describe` leva o ID e o título exatos do caso (ex.: "TC36 - Adição de peça ao carrinho..."), e cada `it` diz o passo.
- Teste de regra (store, utils), não de tela: componentes ainda não têm teste.

## Escopo da Avaliação 1
Vitrine · busca e filtros por produto, técnica, região e categoria · detalhes do produto · perfil do artesão com seus produtos · carrinho (adicionar, remover, alterar quantidade, visualizar) · fluxo inicial de pedido ou simulação de compra · área inicial do comprador · área inicial do artesão (catálogo/estoque) · estrutura inicial do painel admin · deploy público.

Peso na nota: 50% telas, responsividade, navegação e carrinho · 35% Fake API estruturada e preparo para integração (camada de dados, contratos, loading, erro, documentação) · 15% deploy e fluxo testado no ambiente publicado.

## Estrutura de `src/`
```
app/                  rotas; URLs em português (/login, /cadastro, /produtos, /carrinho...)
  (auth)/ (main)/     grupos de rotas com layouts próprios
components/<assunto>/ componentes por domínio, pastas em português (autenticacao, cadastro, inicio, carrinho...)
components/common/    campos de formulário reutilizáveis
components/feedback/  estados de carregamento, erro e vazio
components/ui/        snippets do Chakra (provider, emotion-registry, toaster...)
services/             única camada que faz requisições: api.ts (instância do axios) + um <recurso>.service.ts por recurso
store/                stores Zustand
hooks/                lógica reutilizável (ex.: buscar dados com loading/erro)
types/                entidades e formatos de resposta da API
utils/ constants/     funções auxiliares e valores fixos (categorias, regiões, técnicas)
theme/                system e recipes do Chakra
```
Crie as pastas que ainda não existem conforme a necessidade, seguindo essa organização.

## Fluxo de dados
Componente → hook (`useApi`) → service (`src/services/`) → `api` (axios, em `services/api.ts`) → backend (`backend/`).

- Só `src/services/` faz requisições. Páginas, componentes e stores nunca usam `api`, axios ou `fetch` diretamente.
- Telas buscam dados com `hooks/useApi.ts`, que devolve `data`, `loading`, `error` e `recarregar`.
- Um tipo por entidade (`Produto`, `Artesao`): listas e detalhe devolvem o mesmo formato; o card usa só os campos de que precisa.
- Respostas seguem `src/types/api.ts`: listas em `Paginated<T>`, erros em `ApiErrorBody` (`{ error: { code, message } }`), lançados como `ApiError`.
- O endereço do backend vem de `NEXT_PUBLIC_API_URL` (sem ela, `http://localhost:3001/api`). Só o `services/api.ts` conhece esse endereço.
- Não existe mais Fake API: dado novo precisa de rota no backend, documentada em `docs/api.md` e no Swagger.

## Estado global (Zustand)
- Estado compartilhado entre telas (carrinho, usuário logado) fica em `src/store/`, um store por assunto — ex.: `store/cartStore.ts` exportando `useCartStore`. Não use Context nem Redux para isso.
- Login: `store/authStore.ts` guarda o usuário logado (sem `persist`: o token fica num cookie httpOnly do backend, que o JS não lê). Telas usam o hook `useSessao` (entrar, sair, cadastrar); o `SessionLoader` do layout raiz confere a sessão com `GET /auth/me` ao abrir o site. Áreas protegidas usam `<RequireAuth perfis={[...]}>` num `layout.tsx` (ex.: `app/(main)/artesao/layout.tsx`). A proteção de verdade é a do backend (401/403); o `RequireAuth` só evita mostrar a tela.
- Carrinho: Zustand com `persist` (localStorage), usando os tipos de `src/types/carrinho.ts`. Totais e contagem são calculados a partir dos itens, não guardados no estado. Na Avaliação 2 ele passa a sincronizar com o backend por um service.
- Stores não fazem requisições; se uma ação precisar da API, ela chama um service.
- Componentes que usam store são Client Components (`"use client"`). Com `persist`, o servidor renderiza o carrinho vazio: valores como o contador do carrinho só aparecem depois de montar no navegador, para evitar erro de hidratação.

## Páginas e componentes
- `page.tsx` só monta a tela: usa hooks e compõe componentes. Nada de arrays de dados, regra de negócio ou requisições nele.
- Componentes pequenos, com uma responsabilidade e props tipadas. Estrutura repetida em duas telas vira componente.
- Não misture interface, regra de negócio e acesso a dados no mesmo arquivo.
- Toda tela que carrega dados trata carregando, erro (mensagem do `ApiError`) e vazio.
- Responsivo desde o início, com as props responsivas do Chakra.
- Estilo pelo tema: recipes de `src/theme/recipes/` e tokens de `src/theme/system.ts`, não cores e tamanhos soltos.

## TypeScript
- Tipe entidades, props, respostas da API, dados de formulário e estados.
- Sem `any`; se o tipo for desconhecido, use `unknown` e valide.
- Tipos das entidades ficam em `src/types/` e são os mesmos para services, stores e componentes, iguais aos de `backend/src/shared/types/`.

## Convenções
- Idioma dos nomes: seção "Idioma" do `CLAUDE.md` da raiz (domínio em português sem acento, técnico em inglês, commits em inglês).
- Imports com o alias `@/` (= `src/`).

## Antes de dar uma tela por pronta
- [ ] Dados vêm de um service, nada fixo na tela
- [ ] Carregando, erro e vazio tratados
- [ ] Funciona no celular e no desktop
- [ ] Sem `any`; props tipadas
- [ ] `npm run lint` e `npm run build` passam
- [ ] Rotas novas do backend documentadas em `docs/api.md` e no Swagger
- [ ] Registro em `docs/uso-de-ia.local.md`, se houve apoio relevante de IA
