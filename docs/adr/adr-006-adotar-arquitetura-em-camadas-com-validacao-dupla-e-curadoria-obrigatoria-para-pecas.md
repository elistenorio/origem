# ADR-006: Adotar arquitetura em camadas com validação dupla e curadoria obrigatória para peças

- **Status:** Aceita
- **Data:** 2026-11-23
- **Autor:** AGUINALDO ANSELMO DA COSTA NETO (aacn@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

O Origem é desenvolvido por uma equipe pequena de estudantes, que cursam outras disciplinas ao mesmo tempo, com prazo de um semestre. A stack foi acordada com a disciplina de Desenvolvimento Web (Next.js no frontend; Node, Express, Prisma e PostgreSQL no backend) e a hospedagem é gratuita (Vercel, Render e Supabase). Os artesãos que cadastram peças nem sempre têm familiaridade com sistemas digitais, e muitas peças são únicas. Por isso, um erro no cadastro, como preço errado ou quantidade inválida, vira prejuízo direto para o artesão e frustração para o comprador.

## Preocupações

proteção contra erro do usuário, confiabilidade da vitrine, testabilidade, custo de mudança, prazo

## Decisão

Organizar o backend em camadas (rota → controller → service → repository), validando os dados da peça no formulário do frontend e de novo no controller do backend. Toda peça criada ou editada entra em análise e só aparece na vitrine, e só pode ser comprada, depois de aprovada pela curadoria do administrador.

## Justificativa

O cenário exige que 100% dos envios inválidos sejam bloqueados, inclusive os que chegam direto à API, e que nenhuma peça seja vendida sem aprovação. As camadas garantem isso porque cada proteção fica num lugar só e não pode ser contornada: a validação de formato fica no controller, o ciclo de status da curadoria fica no service, e o filtro "só peças publicadas" fica no repository, usado pela vitrine e pela criação de pedidos. Como as dependências seguem uma direção só, qualquer requisição passa pelo controller antes de chegar ao banco. A validação no frontend não é a garantia: ela orienta o artesão com mensagens ao lado de cada campo. A curadoria cobre o que a validação automática não consegue prever, como um preço válido mas incompatível com a peça.

## Consequências

Ganhos: dados inválidos não chegam ao banco; erros plausíveis, como um preço baixo demais, são barrados antes de chegar ao comprador; cada regra tem um lugar previsível no código, o que facilita testar e explicar.
Perdas: a validação fica duplicada no frontend e no backend, e as duas versões precisam ser mantidas iguais. Uma funcionalidade nova mexe em vários arquivos. A peça demora a ser publicada porque depende da revisão do administrador, e não há prazo definido para essa revisão. A fila de curadoria cresce com o número de artesãos. Toda edição de uma peça publicada a tira da vitrine até nova aprovação, então o artesão pode perder vendas ao corrigir um detalhe.

## Alternativas consideradas

Orientado a Eventos: a curadoria reagiria a um evento "peça enviada para análise". Descartado porque exigiria um broker de mensagens, fora da stack e sem orçamento de hospedagem, e porque a consistência eventual dificultaria garantir que nenhuma peça apareça na vitrine antes de ser aprovada. Portas e Adaptadores: isolaria melhor o domínio, mas a quantidade de interfaces e adaptadores não cabe no prazo nem no tamanho da equipe, e não traz ganho direto para a proteção contra erro do usuário. Validação só no frontend: descartada porque uma requisição feita direto à API não passaria por ela.

## Rastreabilidade

**Atributo de qualidade:** Capacidade de interação · Proteção contra erro do usuário

**Cenário que originou a decisão:**

> Operação normal, artesão inexperiente com idade elevada Tenta cadastrar uma peça única com quantidade maior que 1 Tela de cadastro de peças e na rota de produtos do backend. O sistema bloqueia o envio em caso de dados claramente inválidos mostrando uma mensagem de erro. Nos casos de erro humano, a peça deve ser enviada sem falta para curadoria de Admin humano., 100% das peças novas ou editadas passam pela curadoria antes de aparecer na vitrine, e nenhuma venda acontece com uma peça não aprovada.

**Padrão arquitetural adotado:** Camadas

**Táticas empacotadas:** Encapsular responsabilidades por faixa; Restringir dependências a uma direção; Usar intermediário entre camadas

HU-027 (publicação de peça), HU-030 (estoque), HU-036 (curadoria). Casos de teste TC48, TC09 e TC05. Módulos: frontend/src/utils/productForm.ts, backend/src/application/controllers/minhaConta.controller.ts, backend/src/infrastructure/services/curadoria.service.ts e backend/src/infrastructure/repositories/produtos.repository.ts.

## Verificação

- **Teste do cenário:** TC48, nas duas camadas: no frontend, frontend/tests/utils/productForm.test.ts confirma que o formulário recusa uma peça com preço inválido e mostra a mensagem no campo; no backend, backend/tests/controllers/minhaConta.controller.test.ts confirma que a API devolve VALIDATION para o mesmo envio, mesmo sem passar pela tela. TC09 cobre a quantidade em estoque fora da faixa permitida. TC05 (backend/tests/controllers/admin.controller.test.ts) confirma que o administrador não consegue recusar nem pedir ajustes sem escrever o parecer.

---

_Gerado pelo estudo dirigido de Arquitetura de Software · ADS020 · 2026.2._
