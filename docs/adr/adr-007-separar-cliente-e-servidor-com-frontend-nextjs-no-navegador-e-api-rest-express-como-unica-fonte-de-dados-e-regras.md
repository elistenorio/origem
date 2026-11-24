# ADR-007: Separar cliente e servidor, com o frontend Next.js no navegador e uma API REST Express como única fonte de dados e regras

- **Status:** Proposta
- **Data:** 2026-11-24
- **Autor:** GIULIA MARIANNA DIAS FERREIRA (gmdf@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

A stack foi definida pela disciplina de Desenvolvimento Web: Next.js 16 (App Router), React 19, TypeScript, Chakra UI e Zustand no frontend; Node, Express, Prisma e PostgreSQL no backend. Na Avaliação 1 o frontend lia dados de uma Fake API. Na Avaliação 2 ela foi removida e substituída por um backend real. A hospedagem é gratuita e fica em três lugares: o frontend na Vercel, o backend no Render e o banco no Supabase. Por isso, frontend e backend rodam em domínios diferentes. O Next.js pode rodar código no servidor (Server Components, Route Handlers, Server Actions), então era preciso decidir o que roda no navegador, o que roda no servidor e como os dois conversam. Os ADRs 001 a 006 decidem como o backend se organiza por dentro, mas nenhum registrava essa divisão.

## Preocupações

integridade dos dados (preço, estoque, status do pedido), segurança, contrato estável entre as duas partes, trabalho em paralelo da equipe, aderência à stack da disciplina, hospedagem gratuita

## Decisão

Dividir o sistema em duas aplicações independentes, que se comunicam só por uma API REST com JSON.

**O que roda no navegador (frontend, `frontend/`, publicado na Vercel):** a interface, a navegação entre rotas, o estado da tela e o que serve só à experiência do usuário. As telas são Client Components (`"use client"`) e buscam os dados no navegador, pelo fluxo componente → hook (`useApi`) → service (`src/services/`) → `api` (axios) → backend. O frontend guarda o carrinho no Zustand com `persist` (localStorage) e o usuário logado no `authStore`, sem `persist`. Ele valida formulários (checkout, peça, perfil) para avisar o usuário na hora, e o `RequireAuth` esconde telas de quem não tem o perfil certo. Nada disso é tratado como fonte de verdade. O Next.js não acessa o banco, não tem Route Handlers e não guarda regra de negócio.

**O que roda no servidor (backend, `backend/`, publicado no Render):** todas as regras de negócio e todo acesso a dados. Isso inclui autenticação (JWT em cookie httpOnly) e controle de acesso por perfil (ADR-003), validação final dos dados (ADR-006), cálculo de preço, frete e total do pedido, baixa de estoque atômica (ADR-001), ciclo do pedido, curadoria, cache Redis (ADR-002) e persistência no PostgreSQL pelo Prisma.

**O contrato entre os dois:**
- API REST em JSON sob `/api`, documentada em `docs/api.md` e no Swagger (`/api/docs`). Rota nova só existe depois de documentada nos dois.
- Listas paginadas no formato `{ items, page, pageSize, total }`. Erros sempre no formato `{ error: { code, message } }`, com o status HTTP correspondente (400 `VALIDATION`, 401, 403, 404 `NOT_FOUND`, 409 `OUT_OF_STOCK`). No frontend, o interceptor do `services/api.ts` transforma todo erro em `ApiError`.
- Os tipos das entidades são os mesmos dos dois lados: `frontend/src/types/` espelha `backend/src/shared/types/`.
- A sessão viaja num cookie httpOnly que o backend cria e o navegador envia sozinho (`withCredentials: true` no axios). O backend só aceita a origem do frontend (`cors({ origin: FRONTEND_URL, credentials: true })`). Em produção o cookie usa `sameSite: "none"` e `secure`.
- O endereço do backend vem de `NEXT_PUBLIC_API_URL`, e só o `services/api.ts` o conhece.
- O backend não confia em nada que vem do cliente além da intenção do usuário. No pedido, o frontend manda só os ids das peças, as quantidades, o endereço e a modalidade de frete. Preço, título, valor do frete e total são buscados ou calculados no servidor.

## Justificativa

Com a regra e os dados só no servidor, existe uma única fonte de verdade. Qualquer valor que o navegador guarda pode ser alterado pelo usuário: o preço no carrinho do localStorage, um campo escondido, uma requisição montada à mão. Se o backend recalcula tudo, uma alteração dessas não muda o que é gravado. A divisão também segue a stack pedida por Desenvolvimento Web (Next.js no cliente, Express no servidor) e a hospedagem gratuita disponível, que já separa os dois lados. Com o contrato escrito em `docs/api.md` e no Swagger e os tipos espelhados, a equipe consegue trabalhar em telas e rotas ao mesmo tempo. Dá até para testar a API pelo Swagger antes de a tela existir. Buscar os dados no navegador, e não em Server Components, é consequência do cookie: ele pertence ao domínio do Render e o navegador o envia direto ao backend. O servidor do Next, na Vercel, não recebe esse cookie e não teria como buscar dados em nome do usuário logado.

## Consequências

Ganhos: as regras de negócio e a segurança ficam num lugar só (o backend), fácil de testar sem tela (`npm test` no backend). O frontend pode ser trocado ou refeito sem mexer nas regras. O contrato documentado permite trabalhar em paralelo e serve de base para o Swagger. Erros chegam à tela num formato só, então todas as telas tratam carregando, erro e vazio do mesmo jeito.

Perdas: algumas validações aparecem duas vezes, no formulário (para o usuário) e no backend (para valer), e precisam ser mantidas iguais. Os tipos também são duplicados nos dois lados e podem ficar diferentes se alguém mudar só um deles. Toda tela depende de uma chamada pela rede: no plano gratuito do Render o backend "dorme" sem uso e pode levar até 1 minuto para responder na primeira chamada (por isso o `timeout` de 60 s no axios). Como os dados são buscados no navegador, o HTML inicial das páginas vem sem conteúdo, o que é pior para SEO e para o tempo até aparecer a primeira informação. Por fim, o cookie entre domínios diferentes exige CORS com `credentials` e `sameSite: "none"` com HTTPS, uma configuração fácil de errar no deploy.

## Alternativas consideradas

Next.js full stack (Route Handlers ou Server Actions com Prisma dentro do próprio Next): teria um deploy só e nenhum problema de cookie entre domínios. Foi descartada porque a disciplina pede um backend Node + Express separado e porque misturaria regra de negócio com código de tela no mesmo projeto. Buscar os dados em Server Components com SSR: melhoraria o SEO e o primeiro carregamento, mas o cookie da sessão fica no domínio do Render e não chega ao servidor do Next. Também somaria a espera do Render "acordando" ao carregamento de toda página. Uma camada intermediária (BFF) no Next repassando chamadas ao Express: resolveria o cookie, mas duplica rotas e acrescenta um ponto de falha, um custo alto para o prazo. GraphQL ou tRPC no lugar de REST: ficam fora da stack da disciplina e trariam mais uma tecnologia para a equipe aprender.

## Rastreabilidade

**Atributo de qualidade:** Segurança (security) · Integridade; Modificabilidade

**Cenário que originou a decisão:**

> Em operação normal, um comprador altera no navegador o preço de uma peça guardada no carrinho (localStorage) para R$ 0,01 e confirma o pedido. O backend ignora o preço enviado, busca o preço da peça no banco e grava o pedido com o valor correto em 100% das tentativas. O total do pedido é recalculado no servidor, com o frete também calculado no servidor a partir do CEP.

**Padrão arquitetural adotado:** Cliente-servidor (com API REST como contrato)

**Táticas empacotadas:** Encapsular (a API esconde banco e regras do cliente); Usar intermediário (a API entre a interface e os dados); Restringir dependências (só `services/` fala com o backend); Validar entradas no servidor

frontend/src/services/api.ts, frontend/src/services/*.service.ts, frontend/src/hooks/useApi.ts, frontend/src/store/cartStore.ts, frontend/src/store/authStore.ts, frontend/src/components/autenticacao/RequireAuth.tsx, frontend/src/types/, backend/src/server.ts (CORS), backend/src/shared/cookie.ts, backend/src/shared/types/, backend/src/infrastructure/services/pedidos.service.ts (preço e total calculados no servidor), docs/api.md, backend/src/application/docs/openapi.ts; relacionado ao ADR-001 (estoque), ADR-002 (cache), ADR-003 (controle de acesso), ADR-005 (services) e ADR-006 (camadas e validação dupla)

## Verificação

- **Teste do cenário:** teste automatizado `backend/tests/services/pedidos.service.test.ts`, caso "TC39 - Conclusão de pedido com dados válidos e baixa de estoque" (`npm test` no backend). O teste envia um item de carrinho com `precoUnitario: 0.01`, enquanto a peça custa R$ 167,90 no banco, e confere que o pedido é gravado com `precoUnitario` 167,9. O cenário passa se esse caso passar.
- **Contrato:** com o backend ligado, as rotas e os formatos de resposta e de erro podem ser conferidos no Swagger, em `/api/docs`.
