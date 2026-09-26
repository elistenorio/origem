# Declaração de uso de IA

## 1. Declaração geral

A equipe utilizou ferramentas de Inteligência Artificial durante o desenvolvimento do Projeto Integrador?

- [x] Sim
- [ ] Não

Caso tenha utilizado, descreva de forma geral como a IA apoiou o desenvolvimento do projeto.

A equipe utilizou o Claude (chat) e, principalmente, o Claude Code como apoio no frontend da Avaliação 1: entendimento da estrutura do projeto e planejamento da ordem das telas; prototipação no Figma das telas que faltavam; implementação de telas e componentes a partir do design; revisão da organização de componentes, recipes e pastas; planejamento e implementação da Fake API (tipos, `db.json`, rotas, services, hook `useApi` e stores do carrinho e dos pedidos) e integração das telas com ela; correção de bugs; resolução de conflitos de Git; auditoria do código em relação aos critérios da Avaliação 1; documentação (`CLAUDE.md`, `docs/`, README e `.env.example`) e orientação sobre o deploy.

A maior parte das contribuições foi enviada por pull request, para revisão da equipe antes de entrar na branch `main`. As sugestões foram conferidas no código, com verificação de tipos, build e testes no navegador, e parte delas foi descartada por conflitar com o trabalho de outros integrantes ou com os padrões do projeto (ver seção 7).

---

## 2. Ferramentas utilizadas

| Ferramenta | Finalidade de uso | Integrantes que utilizaram |
|---|---|---|
| ChatGPT |  |  |
| GitHub Copilot |  |  |
| Gemini |  |  |
| Claude | Conversas de apoio: entender a estrutura do frontend (recipes do tema), como rodar o projeto, planejar a ordem das telas e organizar ideias | Giulia Marianna Dias Ferreira, Eulália Regina Silva de Albuquerque |
| Outra: Claude Code (com o conector do Figma) | Prototipação de telas no Figma, implementação e refatoração de telas e componentes, Fake API e integração das telas, correção de bugs, auditoria do código, resolução de conflitos de Git, documentação, README e orientação sobre o deploy | Elis Tenório, Aguinaldo Neto, Sarah Cyrne Ferreira, Eulália Regina Silva de Albuquerque |

---

## 3. Registro dos principais usos

Registros em ordem de data; no mesmo dia, agrupados por integrante. O nome no início de cada uso indica quem utilizou a ferramenta.

| Data | Ferramenta | Uso realizado | Parte do projeto impactada | Resultado incorporado? | Revisão feita pela equipe |
|---|---|---|---|---|---|
| 24/09/2026 | Claude Code | **Elis:** leitura das orientações do professor (página da disciplina e material de skills de IA) e criação dos arquivos de instruções do Claude Code: `CLAUDE.md` na raiz e `frontend/CLAUDE.md`, com escopo da Avaliação 1, stack da disciplina (incluindo Zustand), organização do frontend e regras de registro de IA; criação do `.gitignore` da raiz | Documentação, organização do projeto | Sim | Os dois `CLAUDE.md` foram lidos e revisados antes de entrar no repositório; a revisão pelos demais integrantes ainda está pendente. |
| 24/09/2026 | Claude | **Giulia:** apoio para entender a estrutura de pastas do frontend, o padrão de recipes de tema e como rodar o projeto (`npm install` / `npm run dev`) | Frontend, estrutura geral do projeto | Parcialmente | As explicações foram aplicadas ao rodar o projeto, e a estrutura de telas já existente foi conferida. |
| 24/09/2026 | Claude | **Giulia:** apoio para planejar a ordem de desenvolvimento das telas, definindo a vitrine (home) como ponto de partida | Frontend, telas | Parcialmente | A decisão foi validada antes de iniciar a codificação da tela. |
| 24/09/2026 a 25/09/2026 | Claude Code | **Elis:** análise do repositório e das branches da equipe, análise das telas do Figma (conector do Figma e PNGs exportados) e elaboração do dicionário de dados e do plano da Fake API e dos mocks (tipos, rotas, constantes, divisão em partes) | Arquitetura do frontend, Fake API, documentação | Sim | O dicionário de dados foi revisado em comparação com as telas do Figma. As decisões de nomes (domínio em português, recurso `artesaos`) seguem na Fake API atual. |
| _a confirmar_ | Claude Code (Figma) | **Sarah:** criação das 26 telas que faltavam, revisão das 20 telas existentes para deixá-las uniformes e organização de todas em um fluxo, na página "Telas Novas - Claude" | Protótipo no Figma | Sim | As telas do Figma serviram de base para a implementação das telas restantes no frontend. |
| 25/09/2026 | Claude Code | **Elis:** atualização do `CLAUDE.md` e do `frontend/CLAUDE.md` com a regra de idioma do código (domínio em português, termos técnicos em inglês, commits em inglês) e ajuste da regra de registro de uso de IA (registrar na hora, ao concluir cada contribuição relevante) | Documentação | Sim | As regras estão em vigor nos dois `CLAUDE.md` e foram seguidas no código da Fake API (domínio em português, termos técnicos em inglês) e nos commits. |
| 25/09/2026 | Claude Code | **Elis:** triagem das novas telas do Figma com base no escopo mínimo de cada avaliação do professor: separação do que fica para a U1 e para a U2, rotas da Fake API da U1 e login simulado | Planejamento do frontend, Fake API | Sim | A separação foi seguida: a Fake API implementa só as rotas da U1, as da U2 ficaram como rotas planejadas no `docs/api.md`, e as rotas de `/minha-conta` usam usuários de demonstração no lugar do login. |
| 25/09/2026 | Claude Code | **Elis:** implementação da parte 1 da Fake API (tipos `Produto` e `Artesao`, constantes de categorias, técnicas e regiões, `normalizeText`, mocks de artesãos, produtos e imagens, regras em `app/api/_lib/`, rotas de produtos, relacionados, filtros e artesãos, `produtos.service.ts` e `artesaos.service.ts`), documentação em `docs/api.md` e teste das rotas no servidor local (sucesso, 404, filtros, busca, paginação e página vazia) | Fake API, tipagem TypeScript, services, documentação | Não: descartada e substituída pela nova Fake API (`db.json`) em 25/09/2026, por estar complexa demais | Os mocks e as constantes foram revisados e compreendidos; os tipos, as rotas, `app/api/_lib` e os services não chegaram a ser totalmente compreendidos. Por estar complexa demais, a equipe descartou essa versão e a substituiu pela Fake API atual (`db.json`). |
| 25/09/2026 | Claude Code | **Elis:** comparação da estrutura do frontend com a estrutura recomendada pelo professor; reorganização dos services em `services/api/` (`http.ts` renomeado para `client.ts`), 3 correções pequenas (`normalizeText`, `pagination`, `artesaos.service`), atualização dos `CLAUDE.md` e do `docs/api.md` e novo teste das rotas | Estruturação do frontend, Fake API, documentação | Não: descartada junto com a Fake API anterior | Descartado junto com a primeira Fake API, que foi substituída pela versão atual. |
| 25/09/2026 | Claude Code | **Elis:** revisão de todos os arquivos da parte 1 da Fake API comparando com as telas do Figma (catálogo, artesãos, detalhe): correção da busca com várias palavras e da técnica da Moringa Pintada, retirada de validações e parâmetros que as telas não usam (limite dos relacionados, máximo de página, comparação sem acento nos filtros de seleção), `Content-Type` só em requisições com corpo, atualização do `docs/api.md` e novo teste das rotas | Fake API, correção de bugs, documentação | Não: descartada junto com a Fake API anterior | Descartado junto com a primeira Fake API, que foi substituída pela versão atual. |
| 25/09/2026 | Claude Code | **Elis:** leitura do Notion da disciplina (Capítulo 5, prática Mini Loja com axios e json-server) e comparação com a Fake API do grupo; troca do `fetch` pelo axios em `services/api/client.ts` (instância + interceptor que gera `ApiError`), services no formato da aula, um tipo por entidade (`Produto`, `Artesao`), remoção dos services e do `types/order.ts` antigos, cortes de escopo pela triagem U1/U2 (sem ordenação no catálogo; lista de artesãos sem filtros), atualização do `frontend/CLAUDE.md` e do `docs/api.md` | Consumo de API, Fake API, tipagem TypeScript, documentação | Parcialmente: o código foi descartado; a decisão de usar axios foi mantida na nova Fake API | O código foi descartado, mas a equipe manteve a decisão de usar o axios, que está em `services/api.ts` na versão atual. |
| 25/09/2026 | Claude Code | **Elis:** leitura do Notion da disciplina (página do Projeto Integrador e aulas 05 e 06), das telas de todas as branches e da pasta `dados-exemplo` da `main`; plano de uma Fake API mais simples no formato das aulas (`db.json` lido por Route Handlers, services com axios); descarte da Fake API anterior (guardada no stash) e atualização da branch `feat/fake-api` com a `main` | Arquitetura do frontend, Fake API, estruturação do frontend | Sim | O plano foi adotado: a Fake API da `main` usa `db.json` lido por Route Handlers e services com axios, no formato das aulas. |
| 25/09/2026 | Claude Code | **Elis:** implementação da base e da fase 1 da nova Fake API: tipos divididos em `src/types/` (imports de 32 arquivos trocados), `mocks/db.json` e `db.ts`, `app/api/_lib/` (respostas, paginação, sessão de demonstração), 11 rotas (produtos, relacionados, filtros, artesãos, frete, pedidos, minha conta, meus pedidos, avaliações), services com axios, hook `useApi`, `cartStore` com Zustand; remoção dos services e tipos antigos; lint, build e teste de 29 chamadas às rotas (sucesso, 400, 404 e 409); `docs/api.md` e os dois `CLAUDE.md` atualizados | Fake API, consumo de API, tipagem TypeScript, carrinho, pedidos, documentação | Sim | Lint, build e as 29 chamadas às rotas foram verificados (sucesso, 400, 404 e 409); o código entrou na `main` pela PR #12. |
| 25/09/2026 | Claude Code | **Elis:** plano da Entrega B (telas da fase 1 usando a Fake API, em 5 blocos) e implementação do bloco 1: `ProductCard` e `ArtisanCard` recebendo `Produto` e `Artesao`, home, catálogo, painel de filtros (`GET /filtros`) e lista de artesãos buscando da API com `useApi` e `DataState`; remoção do `adaptadores.ts` e dos tipos antigos em inglês; correção no `useApi` (dados antigos apareciam junto com o erro); teste no navegador (listas, filtros, ordenação, vazio, erro simulado, "Tentar novamente" e celular) | Consumo de API, componentização, correção de bugs | Sim | Testado no navegador (listas, filtros, ordenação, vazio, erro e celular); o código entrou na `main` pela PR #12. |
| 25/09/2026 | Claude Code | **Elis:** bloco 2 da Entrega B: página de detalhe movida de `/produto` para `/produtos/[id]`, mantendo o JSX dos colegas e trocando os textos fixos pelos dados de `GET /produtos/{id}`, do artesão e dos relacionados; "Comprar agora" e "Adicionar ao carrinho" ligados ao `cartStore`; links para `/produto` trocados em 6 arquivos; teste no navegador (peça, 404, artesão sem perfil publicado, clique no card, carrinho e celular). Antes disso, o Claude começou a criar componentes novos por seção e a Elis corrigiu: integrar só editando os arquivos existentes | Consumo de API, carrinho | Sim | A orientação de integrar só editando os arquivos existentes foi seguida; testado no navegador, o código entrou na `main` pela PR #12. |
| 25/09/2026 | Claude Code | **Elis:** bloco 3 da Entrega B: perfil do artesão (`/artesaos/[id]`) usando `GET /artesaos/{id}` e `GET /produtos?artesaoId=`, editando só a página existente; campos opcionais `trabalho`, `origemTrabalho`, `citacaoOrigem` e `gostaDeFazer` no tipo `Artesao` e no `db.json` (textos do Mestre Joãozinho que estavam fixos na página); `docs/api.md` atualizado; teste no navegador (perfil completo, perfil sem as seções opcionais, 404, link a partir da peça e celular) | Consumo de API, tipagem TypeScript, Fake API | Sim | Testado no navegador (perfil completo, perfil sem as seções opcionais, 404 e celular); o código entrou na `main` pela PR #12. |
| 25/09/2026 | Claude Code | **Elis:** bloco 4 da Entrega B: carrinho e checkout usando o `cartStore` (com o frete escolhido), as duas calculadoras de frete usando `GET /frete` (sem a opção "Retirada"), checkout criando o pedido em `POST /pedidos` com carregamento e mensagem de erro, novo `store/ordersStore.ts` para "Meus pedidos" mostrar o pedido criado mesmo no deploy, tratamento do erro de hidratação do carrinho salvo no navegador (`useSyncExternalStore`); teste no navegador da compra completa (adicionar, frete inválido e válido, checkout, pedido criado, estoque insuficiente, celular) | Carrinho, pedidos, consumo de API | Sim | Compra completa testada no navegador (frete inválido e válido, pedido criado, estoque insuficiente e celular); o código entrou na `main` pela PR #12. |
| 25/09/2026 | Claude Code | **Elis:** bloco 5 da Entrega B: "Meus pedidos" com `GET /minha-conta/pedidos` + pedidos feitos no navegador; pop-up de avaliar com `POST /avaliacoes`; nova rota `PATCH /pedidos/{id}` para cancelar (só antes do envio) e pop-up de cancelar usando ela; "Minha conta" com `GET /minha-conta` (dados, endereço, formas de pagamento e pedidos recentes), corrigindo o link "Ver todos" que levava a uma página inexistente e uma linha que vazava no celular; `docs/api.md` atualizado; teste no navegador (lista, cancelar com e sem motivo, avaliar, erro 404 ao cancelar, Minha conta e celular) | Pedidos, consumo de API, Fake API, correção de bugs | Sim | Testado no navegador (cancelar, avaliar, erro 404, Minha conta e celular); o código entrou na `main` pela PR #12. |
| 25/09/2026 | Claude Code | **Elis:** bloco 6 da Entrega B: novas rotas `GET /minha-conta/produtos`, `GET /minha-conta/resumo` e `PATCH /minha-conta/produtos/{id}` (estoque e esconder/mostrar peça); "Meu catálogo", "Estoque" e "Editar peça" do artesão usando essas rotas, com recarga depois de cada ação e alerta de erro; `docs/api.md` atualizado; teste no navegador (listas, resumo, mostrar peça, erro ao esconder rascunho, editar quantidade, peça de outro artesão, celular). Durante o teste, o build falhou porque o OneDrive travou a pasta gerada `.next`; ela foi apagada e gerada de novo | Consumo de API, Fake API | Sim | Testado no navegador (listas, resumo, mostrar e esconder peça, editar quantidade e celular); o código entrou na `main` pela PR #12. |
| 25/09/2026 | Claude Code | **Elis:** bloco 7 da Entrega B: nova rota `GET /admin/painel` (resumo, pendências, notificações e atividades a partir do `db.json`), `services/admin.service.ts` e tela inicial do admin (`AdminHomeView`) usando a rota; `docs/api.md` atualizado; teste no navegador (números, pendências, notificações, atividades e celular) | Consumo de API, Fake API | Sim | Testado no navegador (números, pendências, notificações, atividades e celular); o código entrou na `main` pela PR #12. |
| 25/09/2026 | Claude Code | **Elis:** verificação do merge da `feat/fake-api` na `main` (simulação sem conflitos, correção do `NEXT_PUBLIC_API_URL` vazio) e texto atualizado do README: Fake API, tecnologias, funcionalidades por tela, telas extras com dados de exemplo, acesso às áreas do artesão e do admin, tabela de rotas, limitações e integração futura com o backend | README, documentação, correção de bugs | Parcialmente | A correção do `NEXT_PUBLIC_API_URL` entrou na `main` pela PR #12. O texto novo do README ainda não foi enviado ao repositório. |
| 25/09/2026 | Claude Code | **Aguinaldo:** criação das telas estáticas Nossa Newsletter, Minha Conta e Sobre Nós (a partir de imagens de design), com os componentes `PageBreadcrumb`, `AccountSidebar`, `ValueCard`, `StatHighlight`, `Quote` e extensão do `SectionCard` (movido para `components/common/`) | Frontend: `app/(main)/newsletter`, `app/(main)/minha-conta`, `app/(main)/sobre`, `components/common/`, `components/account/`, `components/institucional/` | Sim | Cada página foi testada com `npm run dev`, conferindo se o estilo corresponde ao design system. Foi encontrado um problema na Newsletter (o card "Após a inscrição" aparecia fixo, antes de clicar em "Quero receber"), que foi corrigido. |
| 25/09/2026 | Claude Code | **Aguinaldo:** criação das telas de Ajuda: Entregas e frete (com calculadora de frete interativa, dado fixo por enquanto), Perguntas frequentes (com filtro por categoria) e Como comprar, a partir de imagens de design; componentes `InfoBox`, `RegionCard`, `StepCard`, `FreightCalculator`; correção de bug no `PageBreadcrumb` (rótulo do meio sem link) e nova variante `chip`/`chipSelecionado` do `button` | Frontend: `app/(main)/ajuda/*`, `components/ajuda/`, `components/common/PageBreadcrumb.tsx`, `theme/recipes/button.ts`, `components/layout/Footer.tsx` | Sim | Cada tela foi verificada manualmente, sem bugs encontrados. A calculadora de frete passou depois a usar `GET /frete` da Fake API. |
| 25/09/2026 | Claude Code | **Aguinaldo:** criação das telas Trocas e devoluções, Formas de pagamento e Termos de uso, a partir de imagens de design; componentes `TimeframeCard`, `ChecklistCard`, `PaymentMethodCard`, `TableOfContents` (sumário com destaque da seção visível); atualização do rodapé (colunas Navegação e Institucional, que estavam com texto solto) | Frontend: `app/(main)/ajuda/trocas-e-devolucoes`, `app/(main)/ajuda/formas-de-pagamento`, `app/(main)/institucional/termos-de-uso`, `components/ajuda/`, `components/institucional/TableOfContents.tsx`, `components/layout/Footer.tsx` | Sim | Cada tela foi testada manualmente no navegador. |
| 25/09/2026 | Claude Code | **Aguinaldo:** criação das telas Política de privacidade e Política de cookies, a partir de imagens de design; extração de um `LegalPageLayout` compartilhado (usado também pelo Termos de uso, que foi migrado); painel de preferências de cookies de verdade (toggles + Zustand com persist em localStorage — primeiro uso do Zustand no projeto, `npm install zustand`); nova recipe `switch` no tema | Frontend: `app/(main)/institucional/politica-de-privacidade`, `app/(main)/institucional/politica-de-cookies`, `components/institucional/LegalPageLayout.tsx`, `components/institucional/CookiePreferencesPanel.tsx`, `store/cookiePreferencesStore.ts`, `theme/recipes/switch.ts`, `components/layout/Footer.tsx`, `package.json` | Sim | Na página de cookies, foi confirmado no devtools que as mudanças nas preferências são salvas de verdade. |
| 25/09/2026 | Claude Code | **Aguinaldo:** auditoria geral do projeto (componentes não usados, redundâncias, arquitetura) e correções combinadas: removidos os snippets mortos do Chakra (`color-mode.tsx`, `toaster.tsx`, `tooltip.tsx`); criado o `Tile` genérico em `components/common/` e migrados 7 cards pra usá-lo; trocada a calculadora de frete falsa da página de produto pelo `FreightCalculator`; unificado o vocabulário de status de pedido (`types/order.ts` passou a usar o `StatusKey` do `StatusBadge`, que foi definido como o oficial) | Frontend: `components/common/Tile.tsx`, `components/ajuda/*Card.tsx`, `components/institucional/ValueCard.tsx`, `components/artesao/CatalogItemCard.tsx`, `app/(main)/produto/page.tsx`, `types/order.ts` | Sim | A troca para os cards genéricos foi verificada manualmente, sem mudança visual. O `types/order.ts` foi removido depois, quando a Fake API trouxe os tipos em português (`types/pedido.ts`). |
| 25/09/2026 | Claude Code | **Sarah:** levantamento, no repositório, das telas já implementadas e das que faltavam (excluindo as telas F a N, de outro integrante) | Planejamento do frontend | Sim | O levantamento serviu de base para a implementação das telas restantes. |
| 25/09/2026 | Claude Code | **Sarah:** primeira versão das telas restantes com uma Fake API completa (rotas, mocks, services, hooks e store do carrinho) | Frontend, Fake API | Não | A equipe pediu para desfazer a parte de API, porque a Fake API estava sendo feita por outra integrante em outra branch e daria conflito. |
| 25/09/2026 | Claude Code | **Sarah:** implementação visual das telas restantes do comprador, do artesão e do admin, seguindo o Figma e as recipes do tema, com dados estáticos de exemplo | Frontend: páginas, componentes, theme/recipes, dados-exemplo, utils e constants | Sim | O código foi mesclado na `main` por outro integrante (PRs #6 e #7). Depois, as telas principais passaram a usar a Fake API no lugar dos dados estáticos (PR #12). |
| 25/09/2026 | Claude Code | **Sarah:** revisão da arquitetura do frontend e ajustes: componentes duplicados unificados, novos componentes reutilizáveis (Timeline, AvatarItem), breadcrumb no PageHeader, recipe sideMenu, formatação de preço centralizada e pastas de componentes renomeadas para português | Frontend: components, theme/recipes, frontend/CLAUDE.md | Sim | Os ajustes aprovados pela equipe estão na `main` (`Timeline`, `AvatarItem`, recipe `side-menu`, pastas em português), exceto a unificação do cálculo de frete, que ficou para a integração com a Fake API. |
| 25/09/2026 | Claude Code | **Sarah:** resolução de conflitos entre a branch de telas e a `main`, seguindo a decisão da equipe de manter o SectionCard como painel padrão | Frontend, Git | Sim | Os conflitos foram resolvidos conforme a decisão da equipe de manter o `SectionCard` como painel padrão; o merge está na `main`. |
| 25/09/2026 | Claude Code | **Sarah:** sugestão de lista mínima de telas para a entrega, considerando o escopo e as dependências | Planejamento da entrega | Parcialmente | A lista foi revisada pela equipe: foram mantidos cadastro, login e as páginas estáticas, e o restante foi aceito. |
| 25/09/2026 | Claude Code | **Sarah:** preenchimento das seções do README e criação do `.env.example` | Documentação, README | Sim | O README e o `.env.example` foram mesclados na `main` por outra integrante (PR #9). |
| 25/09/2026 | Claude Code | **Sarah:** orientação sobre deploy na Vercel e verificação do build de produção | Deploy | Parcialmente | O build de produção foi verificado; o link publicado ainda está como "a definir" no README. |
| _a confirmar_ | Claude Code | **Eulália:** auditoria só de leitura do código em relação aos critérios da Avaliação 1 | Projeto como um todo | Parcialmente | Os pontos levantados (login simulado ausente, links quebrados, botões sem ação, telas com dados fixos, `docs/` vazio, estilos inline, autoria dos commits) foram usados como lista de pendências pela equipe. |
| _a confirmar_ | Claude Code | **Eulália:** padronização das telas antigas com o novo Figma: `PageContainer`/`PageHeader` nas páginas de ajuda, minha conta, newsletter e legais; botão "Excluir conta" com variant `perigo`; `Tile` e `Banner` na página Sobre; biblioteca de ícones padronizada (PR #8) | Frontend, componentização | Ainda não: PR #8 não mesclada na `main` | Cada inconsistência apontada foi conferida no código, e as sugestões que contrariavam o padrão do projeto foram descartadas. A PR #8 ainda não foi mesclada na `main`. |
| _a confirmar_ | Claude Code | **Eulália:** correção da autoria dos commits, que estavam saindo com o nome "Claude" | Histórico do repositório | Sim | O commit da PR #8 foi refeito no nome da integrante, e os commits seguintes já saíram corretamente. |
| _a confirmar_ | Claude Code | **Eulália:** comparação das telas implementadas com o Figma | Frontend | Parcialmente | Só a tela inicial do artesão foi comparada, por limite do plano do Figma. A estrutura do `PageHeader` foi confirmada como fiel ao design. |
| _a confirmar_ | Claude Code | **Eulália:** documentação técnica: `docs/arquitetura.md` (organização do código e migração da Fake API para backend) e `docs/fluxos.md` (fluxos por perfil e limitações conhecidas) (PR #10) | Documentação | Ainda não: PR #10 não mesclada na `main` | A documentação foi pensada para complementar o README (PR #9) sem conflito, e uma afirmação incorreta sobre validação no login foi corrigida antes do commit. A PR #10 ainda não foi mesclada na `main`. |
| 25/09/2026 | Claude Code | **Eulália:** integração das telas do comprador com a Fake API: vitrine, catálogo, artesãos, carrinho, checkout (criação de pedido), meus pedidos, minha conta, página da peça em `/produto/[id]` e perfil do artesão (PR #11) | Frontend, consumo de API, carrinho, pedidos | Não | O fluxo foi testado no navegador, em desktop e celular. A PR #11 não foi mesclada: a integração que entrou na `main` foi a da PR #12. |

---

## 4. Prompts ou descrições relevantes

Registrem os principais prompts utilizados ou descrevam claramente o que foi solicitado à IA.

Não é necessário registrar todas as interações pequenas, mas é obrigatório registrar os usos que influenciaram decisões, código, arquitetura, documentação ou funcionalidades importantes do projeto.

### 1. Instruções do Claude Code para o projeto (Elis)

Prompt ou descrição:

> Pedimos ao Claude Code que lesse as orientações do professor e planejasse um CLAUDE.md para o projeto contendo essas orientações, apresentando o plano antes de gravar os arquivos.

Como a resposta foi utilizada:

> O plano do Claude foi usado como base. A equipe decidiu manter um CLAUDE.md curto na raiz e o principal no frontend (fase atual: Avaliação 1), adotar Zustand para o carrinho, exigir que o Claude apresente um plano antes de codar, registrar o uso de IA localmente e juntar na entrega, e não permitir que o Claude faça commits. Os arquivos só foram gravados depois da aprovação.

### 2. Estrutura do frontend e como rodar o projeto (Giulia)

Prompt ou descrição:

> Pedi para entender como o projeto Origem estava estruturado no frontend (Next.js/Chakra), incluindo o padrão de recipes de tema e como rodar o projeto localmente.

Como a resposta foi utilizada:

> Usei a explicação como referência para rodar o ambiente de desenvolvimento e entender os arquivos de tela já existentes antes de começar a codar novas telas.

### 3. Ordem de desenvolvimento das telas (Giulia)

Prompt ou descrição:

> Pedi apoio para planejar por qual tela começar a desenvolver, considerando as mais de 20 telas já codadas no projeto.

Como a resposta foi utilizada:

> Defini a tela da vitrine (home) como ponto de partida e segui com a implementação por conta própria.

### 4. Dicionário de dados e plano da Fake API (Elis)

Prompt ou descrição:

> Pedimos ao Claude Code que analisasse o repositório, as branches da equipe e as telas do Figma para definir o que a Fake API e os mocks precisam ter, seguindo as orientações do professor.

Como a resposta foi utilizada:

> O dicionário de dados e o plano foram usados como base. O grupo decidiu usar nomes em português para o domínio e em inglês para o que é técnico, chamar o recurso de `artesaos`, usar as 13 categorias da home como lista provisória e fazer a Fake API em duas etapas para não conflitar com as telas dos colegas.

### 5. Telas no Figma (Sarah)

Prompt ou descrição:

> Com base nas telas já prontas no Figma, construir as telas que faltam mantendo o mesmo padrão e design system (desktop 1440 px, reaproveitando componentes e usando auto layout), sem alterar as telas existentes. Depois, revisar as telas prontas para que todas fiquem uniformes e ordená-las em um fluxo que faça sentido.

Como a resposta foi utilizada:

> _pendente_

### 6. Nova Fake API no formato das aulas (Elis)

Prompt ou descrição:

> Pedimos ao Claude Code um plano de Fake API seguindo as orientações do professor no Notion (Projeto Integrador e conteúdo das aulas), a estrutura do Figma e as telas de todas as branches, porque a Fake API que tínhamos estava complexa demais.

Como a resposta foi utilizada:

> _pendente_

### 7. Telas estáticas a partir de imagens de design (Aguinaldo)

Prompt ou descrição:

> A partir de 3 prints de design (Nossa Newsletter, Minha Conta, Sobre Nós), criar as telas estáticas correspondentes, identificando e reaproveitando componentes já existentes no projeto (`FormField`, `AppCheckbox`, `StatusBadge`, `SectionCard`, variantes de `Button`/`Heading`) e criando os que faltavam.

Como a resposta foi utilizada:

> A equipe testou cada página localmente (`npm run dev`) e conferiu se o estilo batia com o design system do projeto.

### 8. Implementação das telas (Sarah)

Prompt ou descrição:

> Implementar as telas que faltam seguindo as orientações da equipe: usar apenas componentes do Chakra UI v3 e as cores do tema, sem Tailwind e sem cores em hex; reaproveitar o ProductCard e as recipes existentes; deixar os estilos nas recipes e só medidas e alinhamento inline. Em seguida, desfazer tudo que fosse relacionado à API e usar dados estáticos, porque a Fake API está sendo feita em outra branch.

Como a resposta foi utilizada:

> _pendente_

### 9. Revisão da arquitetura do frontend (Sarah)

Prompt ou descrição:

> Analisar se a organização por recipes, a estrutura de pastas e os arquivos estavam corretos, apontar redundâncias e componentes que poderiam ser reaproveitados, e aplicar os ajustes aprovados pela equipe (exceto a unificação do cálculo de frete, que ficou para a integração com a Fake API).

Como a resposta foi utilizada:

> _pendente_

### 10. Lista mínima de telas (Sarah)

Prompt ou descrição:

> Listar as telas necessárias para o funcionamento mínimo do Origem, considerando as dependências com a Fake API, para reduzir o material de estudo para a prova.

Como a resposta foi utilizada:

> _pendente_

### 11. Auditoria contra os critérios da Avaliação 1 (Eulália)

Prompt ou descrição:

> Solicitamos uma revisão do código, sem alterações, comparando o estado do projeto com os critérios de avaliação definidos pelo professor.

Como a resposta foi utilizada:

> Os problemas apontados viraram pendências da equipe e orientaram as PRs seguintes (#8, #10 e #11), além da correção da autoria dos commits. [completar]

### 12. Padronização das telas (Eulália, PR #8)

Prompt ou descrição:

> Solicitamos um levantamento das telas feitas antes da revisão do Figma, comparando-as com o novo padrão de design, e a correção das inconsistências encontradas.

Como a resposta foi utilizada:

> O levantamento serviu como ponto de partida. As correções de `PageContainer`, `PageHeader`, `Tile`, `Banner`, variant do botão e ícones foram aplicadas. Sugestões que contrariavam o padrão do projeto (ícones no lugar de "→" e "+", `StatusBadge` como etiqueta e `PageHeader` na newsletter) foram descartadas. [completar]

### 13. Documentação técnica (Eulália, PR #10)

Prompt ou descrição:

> Solicitamos documentação da arquitetura do código e dos fluxos implementados por perfil, complementando o README já existente.

Como a resposta foi utilizada:

> Os arquivos `docs/arquitetura.md` e `docs/fluxos.md` foram adicionados ao projeto. A ideia inicial de abrir um README próprio foi abandonada para não conflitar com a PR #9. [completar]

### 14. Integração com a Fake API (Eulália, PR #11)

Prompt ou descrição:

> Solicitamos a ligação das telas do comprador aos dados da Fake API, incluindo a criação real de pedidos no checkout e as páginas dinâmicas de peça e de artesão.

Como a resposta foi utilizada:

> A integração foi incorporada e testada no navegador em desktop e celular. Durante os testes, foi identificado um problema no `package-lock.json` da branch da Fake API. [completar]

---

## 5. Partes do projeto que tiveram apoio de IA

Marquem os itens em que houve uso de IA.

- [x] Entendimento do problema
- [x] Pesquisa técnica
- [x] Prototipação de telas
- [x] Estruturação do frontend
- [x] Componentização
- [x] Tipagem TypeScript
- [x] Consumo de API
- [x] Fake API
- [ ] Backend
- [ ] Banco de dados
- [ ] Autenticação
- [x] Carrinho
- [x] Pedidos
- [ ] Recomendação
- [ ] Processamento assíncrono
- [ ] Cache
- [x] Testes
- [x] Documentação
- [x] README
- [x] Deploy
- [x] Correção de bugs
- [x] Outro: resolução de conflitos de Git; planejamento das telas da entrega; auditoria do código em relação aos critérios de avaliação; comparação com o Figma; correção da autoria dos commits

---

## 6. Validação humana

A equipe declara que:

- [x] Todo código gerado ou sugerido por IA foi revisado pelos integrantes.
- [x] O código incorporado foi testado antes da entrega.
- [x] A equipe compreende as partes implementadas com apoio de IA.
- [x] A equipe está apta a explicar tecnicamente as decisões tomadas.
- [x] Nenhuma parte relevante foi incorporada sem análise, adaptação ou validação.
- [x] As limitações, erros ou sugestões inadequadas da IA foram avaliadas pela equipe.

---

## 7. Limitações e problemas encontrados

Descrevam situações em que a IA sugeriu algo incorreto, incompleto, incompatível com o projeto ou que precisou ser descartado.

Registro da equipe:

**Sugestões descartadas ou refeitas**

- (Elis) A primeira Fake API feita com apoio do Claude Code imitava um backend completo (camada de service e repository em `app/api/_lib/`, junção de produto com artesão, busca palavra por palavra, recomendação com pontuação). Funcionava, mas ficou complexa demais para a Avaliação 1 e difícil de explicar na apresentação. Elis percebeu o problema; o código foi descartado e refeito no formato das aulas do professor (`db.json` lido por Route Handlers, services com axios).
- (Sarah) A primeira versão das telas incluía uma Fake API completa, o que conflitava com o trabalho de outra integrante. A parte de API foi descartada e as telas passaram a usar dados estáticos.
- (Sarah) A IA criou um componente de painel (Panel) que duplicava o SectionCard já existente. A equipe decidiu manter o SectionCard, e os usos do Panel foram substituídos.
- (Elis) Na integração da página de detalhe da peça, o Claude começou a criar componentes novos por seção. Elis corrigiu: a integração foi feita só editando os arquivos existentes.
- (Eulália) A IA apontou como inconsistência o uso de "→" e "+" nos botões e sugeriu trocá-los por ícones. Ao conferir o código, verificou-se que "texto →" é o padrão do projeto inteiro, inclusive nas telas novas. A sugestão foi descartada.
- (Eulália) A IA sugeriu usar `StatusBadge` para as etiquetas "Peça única" e "Novo". Como esse componente é destinado a status (pedido, estoque), e não a etiquetas, foram usadas as tags da própria peça.
- (Eulália) O plano previa aplicar `PageHeader` na página da newsletter, mas o título faz parte de um layout em duas colunas. Foi usado apenas o `PageContainer`, para preservar o visual.

**Erros da IA**

- (Elis) Ao planejar a nova versão da Fake API, o Claude Code errou o nome de um arquivo técnico (`paginar.ts`, em português, contra a regra de idioma do projeto) e sugeriu colocar código das rotas dentro de `mocks/`, misturando dados com lógica. Os dois pontos foram corrigidos depois que Elis pediu para conferir o plano contra as regras do projeto e a stack.
- (Sarah e Eulália) Os commits feitos pela ferramenta saíram com o autor "Claude", e o commit da PR #8 subiu assim. O problema foi percebido na auditoria, e os commits foram refeitos para registrar as integrantes como autoras.
- (Aguinaldo) Na página da Newsletter, o card "Após a inscrição" ficou fixo na tela, mas só deveria aparecer depois de clicar em "Quero receber". O problema foi encontrado nos testes e corrigido.
- (Sarah) Durante uma refatoração, o build de produção falhou porque funções estavam sendo passadas de um Server Component para um Client Component. O erro foi identificado no build e corrigido antes do envio.
- (Eulália) Em uma correção no `LegalPageLayout` (PR #8), a IA deixou cor e tamanho de fonte como estilo inline, embora o `textStyle` `apoio` já existisse, contrariando a regra das recipes. O problema foi identificado e está pendente de correção.
- (Eulália) No `docs/fluxos.md`, a IA afirmou que a tela de login validava os campos. A conferência no código mostrou que apenas os cadastros validam, e o texto foi corrigido antes do commit.
- (Eulália) Ao remover dados de exemplo sem uso, um script apagou também funções do painel admin que estavam no mesmo arquivo. O `tsc` acusou o erro e o arquivo foi restaurado antes do commit.
- (Eulália) Em um estouro de largura na página Minha conta (celular), a IA diagnosticou a causa errada e alterou o `SectionCard`. A causa real era a linha dos pedidos recentes; a primeira alteração foi desfeita e a correção aplicada no lugar certo.

**Limitações**

- (Sarah) As fontes da marca (Brandon Grotesque e Trade Gothic Next) não estavam disponíveis no Figma. A IA usou fontes substitutas e estilos de texto nomeados, e a troca pelas fontes reais ficou a cargo da equipe.
- (Sarah) Um patch gerado pela IA não aplicou porque a branch tinha sido atualizada por outro integrante. Foi preciso gerar uma nova versão sobre o código atualizado.
- (Eulália) A comparação com o Figma ficou incompleta: as comparações foram disparadas em paralelo sem considerar o limite do plano Starter do Figma, e o ambiente da ferramenta não tinha acesso ao figma.com para baixar imagens. Apenas uma tela foi comparada.
- (Eulália) No início, a ferramenta não tinha acesso ao repositório, e o push precisou ser feito manualmente pela integrante após a liberação.

---

## 8. Responsabilidade da equipe

A equipe declara que todo conteúdo entregue no projeto foi revisado, compreendido e validado pelos integrantes.

A equipe reconhece que o uso de IA não substitui a responsabilidade técnica sobre o projeto e que todos os integrantes devem ser capazes de explicar as funcionalidades, decisões técnicas, código, integrações e documentação entregues.
