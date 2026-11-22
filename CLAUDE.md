# Origem

Marketplace da economia criativa e do artesanato de Pernambuco — Projeto Integrador 2026.2 (CESAR School), disciplina de Desenvolvimento Web. Conecta artesãos a compradores, valorizando origem, técnica e história das peças.

Perfis:
- **Comprador**: vitrine, busca e filtros, carrinho, pedidos, avaliações.
- **Artesão**: catálogo, estoque, pedidos, perfil, história das peças.
- **Administrador**: gestão da plataforma, indicadores, curadoria.

## Fase atual: Avaliação 2
Backend real: Node + TypeScript + Express + Prisma + PostgreSQL, com autenticação JWT em cookie httpOnly e rotas protegidas por perfil. A Fake API da Avaliação 1 foi removida: o frontend busca tudo no backend (`NEXT_PUBLIC_API_URL`; sem ela, `http://localhost:3001/api`). Rotas, parâmetros e formatos estão em `docs/api.md`.

Deploy: banco no Supabase, backend no Render e frontend na Vercel. Swagger do backend em `/api/docs` e cache com Redis em `GET /produtos` e `GET /produtos/:id`. Processamento assíncrono ainda não foi decidido: não implemente sem pedido explícito.

- `frontend/` — aplicação Next.js. Regras detalhadas em `frontend/CLAUDE.md`.
- `backend/` — API Express + Prisma. Regras detalhadas em `backend/CLAUDE.md`.
- `docs/api.md` — contrato da API. `docs/arquitetura.md` — decisões de arquitetura. `docs/uso-de-ia.md` — declaração de uso de IA.
- `README.md` — segue o modelo mínimo do professor.

## Regras gerais
- Todo código em TypeScript. Não usar TS ou fugir da stack da disciplina zera o item na avaliação.
- Não adicione bibliotecas ou tecnologias fora da stack sem perguntar.
- Antes de criar uma tela, uma funcionalidade ou uma mudança em vários arquivos, apresente um plano (arquivos a criar/alterar, componentes, tipos, services, stores) e espere aprovação. Correções pequenas podem ir direto.
- Ao terminar, explique o que foi feito e por quê: todos os integrantes precisam saber explicar o código na apresentação.

## Idioma
- **Português, sem acento**, em tudo que é do domínio: rotas da API (`/produtos`, `/artesaos`, `/pedidos`, `/minha-conta`), tipos e seus campos (`Produto`, `titulo`, `preco`, `artesaoId`), parâmetros de filtro e seus valores (`busca`, `categoria`, `ordenar=menor_preco`), services e suas funções (`produtos.service.ts`, `listar`), tabelas do Prisma (`Produto`, `Pedido`), constantes (`constants/categorias.ts`) e hooks de domínio (`useProdutos`).
- **Inglês** no que é técnico: formato das respostas (`Paginated`, `ApiError`, `{ error: { code, message } }`), códigos de erro (`NOT_FOUND`, `VALIDATION`), paginação (`page`, `pageSize`, `pagination.ts`), `services/api.ts`, stores (`cartStore.ts`), utils (`normalizeText.ts`), nomes de componentes (`ProductCard`) e hooks genéricos (`useApi`).
- Textos da interface, comentários e documentação em português.
- Mensagens de commit em inglês, no formato Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:` (ex.: `feat: add curation routes`).

## Documentação
- Criou ou alterou uma rota da API: atualize `docs/api.md` (método, rota, parâmetros, exemplo de resposta e erros) e o Swagger (`backend/src/application/docs/openapi.ts`).
- Documente só o que existe no código.
- README: mantenha as seções do modelo do professor e indique `main` como branch principal. `.env.example` nunca com credenciais reais.

## Declaração de uso de IA
O arquivo oficial é `docs/uso-de-ia.md` (obrigatório e avaliado). Durante o desenvolvimento, cada integrante registra seus usos num arquivo local, fora do git: `docs/uso-de-ia.local.md` (está no `.gitignore`). Os registros são juntados no arquivo oficial antes de cada entrega.

Ao concluir uma contribuição relevante (código, arquitetura, documentação ou decisão importante; não dúvidas rápidas nem correções pequenas), registre na hora, antes da resposta final daquela tarefa, e não no fim da sessão. Na dúvida se é relevante, pergunte ao integrante:
- Adicione uma linha em `docs/uso-de-ia.local.md`, no formato da tabela da seção 3 do arquivo oficial: data (dd/mm/aaaa), ferramenta "Claude Code", uso realizado, parte do projeto impactada, se foi incorporado e "Revisão feita pela equipe". Se o arquivo não existir, crie-o com o nome do integrante (`git config user.name`) no topo.
- Anote também as partes do projeto que tiveram apoio (lista da seção 5) e, em decisões grandes, a descrição do pedido e como a resposta foi utilizada (seção 4).
- Pergunte ao integrante como ele revisou, adaptou ou testou o resultado e como usou a resposta. Preencha "Revisão feita pela equipe" e "Como a resposta foi utilizada" com as palavras dele, sem acrescentar nada que ele não tenha confirmado. Se ele ainda não revisou, deixe `_pendente_`.
- Não edite `docs/uso-de-ia.md` durante o desenvolvimento, só quando pedirem para consolidar. Na consolidação, junte os registros em ordem de data, indicando quem usou.
- Nunca marque as caixas da seção 6 (Validação humana): isso é declaração dos integrantes.
