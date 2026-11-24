# ADR-002: Adotar cache Redis como modelo de leitura da vitrine (CQRS leve)

- **Status:** Proposta
- **Data:** 2026-11-22
- **Autor:** ELIS MAIDI TENORIO CHAPRAO (emtc@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

Equipe pequena de estudantes, prazo de um semestre e hospedagem gratuita: backend no Render (EUA) e banco no Supabase (São Paulo). Hoje um filtro na vitrine leva 1,3 s, e 7,4 s no p95 com 50 compradores ao mesmo tempo.

## Preocupações

desempenho, custo de hospedagem, consistência dos dados, prazo

## Decisão

Guardar as respostas de GET /produtos e GET /produtos/:id no Redis e limpar esse cache sempre que uma peça mudar.

## Justificativa

A demora vem da ida ao banco, que fica longe do backend. Com o cache, a resposta sai pronta do Redis, sem passar pelo banco, o que deve permitir chegar a 1 s mesmo com 50 compradores. O Redis já está na stack e é gratuito no Render.

## Consequências

A vitrine fica mais rápida e o banco recebe menos consultas. Em troca, os dados ficam em dois lugares, toda mudança em uma peça precisa limpar o cache e o comprador pode ver um dado desatualizado por um instante.

## Alternativas consideradas

Cliente-servidor com várias cópias do servidor: exige pagar mais instâncias e não resolve a distância até o banco. CQRS completo: pesado demais para a equipe e o prazo.

## Rastreabilidade

**Atributo de qualidade:** Eficiência de desempenho · Comportamento temporal

**Cenário que originou a decisão:**

> Em operação normal, com o servidor ativo e cerca de 50 compradores navegando ao mesmo tempo, um comprador aplica o filtro da categoria "Tecidos e Bordados" na listagem de peças da vitrine (GET /produtos). O sistema exibe a primeira página de peças da categoria, em até 1 segundo no percentil 95 das requisições.

**Padrão arquitetural adotado:** CQRS

**Táticas empacotadas:** Separar modelo de leitura e de escrita

backend/src/infrastructure/cache/, produtos.service.ts, render.yaml, PR #20.

## Verificação

- **Teste do cenário:** Com o servidor ativo, disparar 50 requisições ao mesmo tempo para GET /api/produtos?categoria=tecidos-bordados. Passa se o p95 for de até 1 s.

---

_Gerado pelo estudo dirigido de Arquitetura de Software · ADS020 · 2026.2._
