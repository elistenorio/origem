# ADR-003: Isolar o controle de acesso em uma camada de middlewares de autenticação e perfil

- **Status:** Proposta
- **Data:** 2026-11-22
- **Autor:** GIULIA MARIANNA DIAS FERREIRA (gmdf@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

O Origem atende três perfis no mesmo sistema (comprador, artesão e administrador), e cada um guarda dados que os outros não podem ver: endereço e pedidos do comprador, estoque e vendas do artesão, indicadores e curadoria do administrador. Na Avaliação 2, a Fake API foi substituída por um backend real (Node, TypeScript, Express, Prisma e PostgreSQL), hospedado no Render, com banco no Supabase. A equipe é pequena, formada por estudantes com outras disciplinas em paralelo, o prazo é de um semestre, a stack foi acordada com Desenvolvimento Web e não há orçamento para serviços pagos de autenticação.

## Preocupações

confidencialidade, controle de acesso por perfil, proteção de dados pessoais (LGPD), prazo, simplicidade

## Decisão

Organizar o backend em camadas e colocar toda a verificação de acesso numa camada de middlewares, antes dos controllers: o authMiddleware confere o token JWT guardado em cookie httpOnly (401 se faltar ou for inválido) e o roleMiddleware confere o perfil exigido pela rota (403 se for o perfil errado). A verificação de dono do recurso (por exemplo, quem pode alterar um pedido) fica na camada de service.

## Justificativa

O cenário exige que um comprador que tenta acessar GET /admin/painel receba 403 em 100% das tentativas, sem nenhum dado no corpo da resposta. Com a verificação concentrada nos middlewares, toda requisição passa pelo mesmo ponto de controle antes de chegar ao controller, ao service e ao banco. Uma requisição barrada nunca consulta dados, então não há o que vazar. O usuário é identificado pelo token do cookie, nunca por um id enviado na URL, o que impede ver a conta de outra pessoa trocando um número no endereço. Como o cookie é httpOnly, o JavaScript da página não consegue ler o token, o que protege contra roubo de sessão por XSS.

## Consequências

Ganhos: a regra de acesso fica num lugar só e fácil de explicar e revisar; a resposta é padronizada (401 sem login, 403 sem permissão); proteger uma rota nova é só registrar os middlewares nela; não depende de serviço pago de autenticação. 

Perdas: se alguém esquecer de colocar o middleware numa rota nova, ela fica aberta, e nada no código avisa; a verificação de dono do recurso não cabe no middleware e fica no service, então a regra de acesso fica dividida em dois lugares; há mais arquivos e camadas para cada funcionalidade; o cookie entre domínios diferentes (Vercel e Render) exige sameSite "none" com HTTPS, o que complica a configuração.

## Alternativas consideradas

Portas e Adaptadores: isolaria mais o domínio com interfaces, mas exige uma interface e um adaptador por dependência, um custo alto para a equipe e o prazo, e a stack (Express + Prisma) não será trocada; para a confidencialidade, o ganho seria pequeno. Orientado a Eventos: descartado porque o controle de acesso precisa responder na hora (401/403), e não de forma assíncrona. Verificar o acesso dentro de cada controller: descartado porque espalha a regra e aumenta a chance de esquecer em algum lugar. Guardar o token no localStorage: descartado porque qualquer script da página conseguiria lê-lo.

## Rastreabilidade

**Atributo de qualidade:** Segurança (security) · Confidencialidade

**Cenário que originou a decisão:**

> Em operação normal, um comprador autenticado envia uma requisição para GET /admin/painel, rota restrita ao administrador. O backend bloqueia o acesso nos middlewares de autenticação e de perfil e responde 403 FORBIDDEN em 100% das tentativas, sem nenhum dado do painel no corpo da resposta. A mesma requisição feita sem login responde 401 UNAUTHORIZED.

**Padrão arquitetural adotado:** Camadas

**Táticas empacotadas:** Encapsular responsabilidades por faixa; Usar intermediário entre camadas

backend/src/middleware/authMiddleware.ts, backend/src/middleware/roleMiddleware.ts, backend/src/shared/cookie.ts, backend/src/shared/jwt.ts, backend/src/application/routes/admin.routes.ts, backend/src/application/routes/minhaConta.routes.ts, backend/src/infrastructure/services/pedidos.service.ts (verificação de dono do pedido); relacionado ao ADR 0001 (estoque) e ao ADR-002 (cache)

## Verificação

- **Teste do cenário:** Teste automatizado backend/tests/controleDeAcesso.test.ts (npm test, usando node:test, nativo do Node): sem login, GET /api/admin/painel deve responder 401; logado como comprador e como artesão, deve responder 403 com corpo contendo apenas { error: { code, message } }, sem dados do painel; logado como admin, deve responder 200. O cenário passa se os 4 casos passarem. Pode rodar localmente ou contra o backend do Render (variável API_URL).

---

_Gerado pelo estudo dirigido de Arquitetura de Software · ADS020 · 2026.2._
