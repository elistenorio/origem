@AGENTS.md

# Frontend — Origem

Stack da disciplina: Next.js 16 (App Router), React 19, TypeScript, Chakra UI v3, Tailwind, Zustand e axios (requisições, como na aula de Integração com APIs). Nada além disso sem perguntar.

## Comandos (dentro de `frontend/`)
- `npm run dev` — servidor local
- `npm run build` — build de produção; rode antes de dar a tarefa por concluída
- `npm run lint` — ESLint
- `npm run typegen` — regenera os tipos do tema do Chakra; rode depois de mudar `src/theme/`

## Escopo da Avaliação 1
Vitrine · busca e filtros por produto, técnica, região e categoria · detalhes do produto · perfil do artesão com seus produtos · carrinho (adicionar, remover, alterar quantidade, visualizar) · fluxo inicial de pedido ou simulação de compra · área inicial do comprador · área inicial do artesão (catálogo/estoque) · estrutura inicial do painel admin · deploy público.

Peso na nota: 50% telas, responsividade, navegação e carrinho · 35% Fake API estruturada e preparo para integração (camada de dados, contratos, loading, erro, documentação) · 15% deploy e fluxo testado no ambiente publicado.

## Estrutura de `src/`
```
app/                  rotas; URLs em português (/login, /cadastro, /produtos, /carrinho...)
  (auth)/ (main)/     grupos de rotas com layouts próprios
  api/                Fake API (Route Handlers), lê os dados de mocks/
    _lib/             apoio às rotas (respostas, paginação, sessão de demonstração); o "_" tira a pasta das rotas
components/<assunto>/ componentes por domínio, pastas em português (autenticacao, cadastro, inicio, carrinho...)
components/common/    campos de formulário reutilizáveis
components/feedback/  estados de carregamento, erro e vazio
components/ui/        snippets gerados pelo Chakra (provider, toaster...)
services/             única camada que faz requisições: api.ts (instância do axios) + um <recurso>.service.ts por recurso
store/                stores Zustand
hooks/                lógica reutilizável (ex.: buscar dados com loading/erro)
types/                entidades e formatos de resposta da API
mocks/                dados sintéticos da Fake API: db.json (uma lista por recurso) + db.ts (tipagem)
utils/ constants/     funções auxiliares e valores fixos (categorias, regiões, técnicas)
theme/                system e recipes do Chakra
```
Crie as pastas que ainda não existem conforme a necessidade, seguindo essa organização.

## Fluxo de dados
Componente → hook (`useApi`) → service (`src/services/`) → `api` (axios, em `services/api.ts`) → `/api/*` (Fake API em `src/app/api/`, que lê `src/mocks/db.json`).

- Só `src/services/` faz requisições. Páginas, componentes e stores nunca usam `api`, axios ou `fetch` diretamente.
- Telas buscam dados com `hooks/useApi.ts`, que devolve `data`, `loading`, `error` e `recarregar`.
- Um tipo por entidade (`Produto`, `Artesao`): listas e detalhe devolvem o mesmo formato; o card usa só os campos de que precisa.
- Mocks só são importados pelas rotas de `src/app/api/`.
- Respostas seguem `src/types/api.ts`: listas em `Paginated<T>`, erros em `ApiErrorBody` (`{ error: { code, message } }`), lançados como `ApiError`.
- Na Avaliação 2 basta definir `NEXT_PUBLIC_API_URL` apontando para o backend; services, hooks e componentes não mudam. Não quebre essa garantia.
- Recursos da Fake API: produtos, artesãos, usuários, categorias, técnicas, regiões, pedidos, avaliações e recomendações iniciais.

## Estado global (Zustand)
- Estado compartilhado entre telas (carrinho; depois, usuário logado) fica em `src/store/`, um store por assunto — ex.: `store/cartStore.ts` exportando `useCartStore`. Não use Context nem Redux para isso.
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
- Tipos das entidades ficam em `src/types/` e são os mesmos para Fake API, services, stores e componentes.

## Convenções
- Idioma dos nomes: seção "Idioma" do `CLAUDE.md` da raiz (domínio em português sem acento, técnico em inglês, commits em inglês).
- A pasta `dados-exemplo/` e os tipos antigos em inglês (`types/product.ts`, `types/artisan.ts`) ainda alimentam as telas que não migraram para a Fake API. Não use em código novo; eles saem quando as telas migrarem.
- Imports com o alias `@/` (= `src/`).

## Antes de dar uma tela por pronta
- [ ] Dados vêm de um service, nada fixo na tela
- [ ] Carregando, erro e vazio tratados
- [ ] Funciona no celular e no desktop
- [ ] Sem `any`; props tipadas
- [ ] `npm run lint` e `npm run build` passam
- [ ] Rotas novas da Fake API documentadas em `docs/api.md`
- [ ] Registro em `docs/uso-de-ia.local.md`, se houve apoio relevante de IA
