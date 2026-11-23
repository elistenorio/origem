# ADR-004: Centralizar as regras de acessibilidade da interface numa camada de tema compartilhada

- **Status:** Aceita
- **Data:** 2026-11-23
- **Autor:** SARAH CYRNE FERREIRA (scf2@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

O Origem é feito por uma equipe pequena de estudantes, com prazo de um semestre e cursando outras disciplinas ao mesmo tempo. O frontend usa Next.js com Chakra UI, stack acordada com a disciplina de Desenvolvimento Web, e várias pessoas mexem nas telas ao mesmo tempo, cada uma na sua parte. Uma parte importante do público são artesãos com pouca familiaridade com tecnologia, que precisam usar a área do artesão sozinhos pelo celular. Na mentoria, o professor apontou problemas de legibilidade e contraste no front, e várias telas tinham fonte pequena e cor definida direto no código.

## Preocupações

acessibilidade, legibilidade, consistência entre telas, custo de mudança, prazo

## Decisão

Concentrar as regras visuais de acessibilidade (tamanhos mínimos de fonte, cores com contraste AA, tamanho dos botões e dicas nos campos) numa camada de tema do Chakra, com tokens e recipes, e fazer as telas usarem só essa camada, sem definir cor ou tamanho direto no componente.

## Justificativa

Com as regras num lugar só, a acessibilidade não depende de cada pessoa lembrar de aplicar em cada tela. Se o tema garante fonte mínima de 16 px e contraste de 4,5:1, toda tela nova já nasce dentro do padrão. E para ajustar algo depois, como aumentar a fonte do corpo, basta mudar o tema, sem passar tela por tela. Isso cabe no prazo e no tamanho da equipe.

## Consequências

De positivo, as telas ficam consistentes, a acessibilidade vale pra todo mundo e mudanças visuais ficam mais baratas. De negativo, a equipe precisa de disciplina pra não colocar estilo solto no código, uma mudança no tema afeta todas as telas e precisa de revisão pra ver se nada quebrou, e casos diferentes exigem criar uma variação no tema em vez de ajustar só na tela.

## Alternativas consideradas

Deixar cada tela cuidar do próprio estilo foi descartado porque é o que causou o problema de fonte pequena e contraste ruim. Um "modo acessível" como extensão separada (Microkernel) também foi descartado, porque deixaria a acessibilidade opcional e daria trabalho demais pra montar no prazo.

## Rastreabilidade

**Atributo de qualidade:** Capacidade de interação · Inclusividade

**Cenário que originou a decisão:**

> Pelo celular, em operação normal, sem ninguém da equipe Origem ajudando, um artesão com pouca experiência no uso de computador e celular quer cadastrar uma peça nova pela primeira vez na área do artesão, no formulário "Adicionar peça" e nos componentes de tela compartilhados (tema). O sistema permite que o artesão preencha e envie a peça para análise sozinho, entendendo cada campo pelas dicas da tela, em até 10 minutos e sem pedir ajuda, com todos os textos da tela a partir de 16 px e contraste mínimo de 4,5:1 (padrão AA da WCAG).

**Padrão arquitetural adotado:** Camadas

**Táticas empacotadas:** Encapsular responsabilidades por faixa; Restringir dependências a uma direção; Usar intermediário entre camadas

Módulos: frontend/src/theme/system.ts (cores e tamanhos de fonte), frontend/src/theme/recipes/ (botões, campos, cards e menu lateral) e os campos compartilhados em frontend/src/components/common/ (FormField, SelectField e TextareaField, com a dica de preenchimento). Histórias: HU02 (cadastro de artesão), HU21 (adicionar peça), HU22 (editar peça), HU23 (controle de estoque) e HU24 (editar perfil do artesão).

## Verificação

- **Teste do cenário:** Teste com uma pessoa que não conhece o sistema e tem pouca familiaridade com tecnologia: pelo celular e sem ajuda, ela cadastra uma peça em "Adicionar peça" até enviar para análise, e o tempo é cronometrado. O cenário passa se ela terminar em até 10 minutos sem pedir ajuda. Junto com isso, rodar o Lighthouse (aba Acessibilidade) e um verificador de contraste nas telas da área do artesão, conferindo que nenhum texto fica abaixo de 16 px nem com contraste menor que 4,5:1. Nos PRs, revisar se apareceu cor ou tamanho de fonte definido fora do tema.

---

_Gerado pelo estudo dirigido de Arquitetura de Software · ADS020 · 2026.2._
