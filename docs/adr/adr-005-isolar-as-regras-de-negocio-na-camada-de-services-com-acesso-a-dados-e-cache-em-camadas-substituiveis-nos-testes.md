# ADR-005: Isolar as regras de negócio na camada de services, com acesso a dados e cache em camadas substituíveis nos testes

- **Status:** Aceita
- **Data:** 2026-11-23
- **Autor:** CALIEL FEIJÓ DE MELO SILVA (mfms2@cesar.school)
- **Turma:** Embarque (segundas)
- **Projeto:** Origem · marketplace da economia criativa e do artesanato de Pernambuco

## Contexto

O Origem é feito por uma equipe pequena de estudantes, com prazo de um semestre e outras disciplinas em paralelo. O backend (Node, TypeScript, Express, Prisma e PostgreSQL, com Redis para cache) foi acordado com Desenvolvimento Web e está hospedado no Render, sem orçamento para ambientes extras de teste. Várias pessoas alteram as mesmas regras de pedido, estoque e cadastro ao mesmo tempo, e o plano de testes da disciplina precisa ser executado e ter os resultados registrados. Testar tudo pela tela, com a API e o banco no ar, é lento e depende do ambiente estar funcionando.

## Preocupações

testabilidade, custo de mudança, confiabilidade das regras de negócio, prazo, simplicidade

## Decisão

Manter todas as regras de negócio do backend na camada de services, com o acesso a dados (Prisma/PostgreSQL) isolado nos repositories e o Redis isolado no módulo de cache, com dependências só de cima para baixo (controller → service → repository). Nos testes unitários, repositories e cache são trocados por funções falsas com jest.mock, e o service roda de verdade.

## Justificativa

O cenário exige que a suíte rode sem banco e sem a API ligada, em até 1 minuto, apontando pelo ID do caso qual regra quebrou. Como a regra fica só no service e ele depende apenas dos repositories e do cache, basta trocar essas duas dependências por mocks para testar a regra isolada, em qualquer máquina. Hoje o npm test do backend roda 106 testes em cerca de 9 segundos, sem banco, e cada describe leva o ID do plano de testes (ex.: TC09). A própria suíte já detectou dois defeitos reais: o estoque 1000 sendo aceito (TC09) e a senha sem caractere especial sendo aceita (TC25).

## Consequências

Ganhos: feedback em segundos a cada mudança; testes rodam em qualquer máquina, sem Docker nem banco; a saída do npm test usa os mesmos IDs do plano de testes, o que facilita registrar os resultados; cada camada tem uma responsabilidade clara. Perdas: mais arquivos e camadas por funcionalidade; a equipe precisa de disciplina para não colocar regra no repository nem acessar o Prisma direto do service, senão o teste volta a depender do banco; os mocks podem divergir do comportamento real do banco, então disputas reais de concorrência (TC01/TC02) não são cobertas no nível unitário e continuam precisando de teste de integração.

## Alternativas consideradas

Portas e Adaptadores: isolaria ainda mais o domínio, mas exige uma interface e um adaptador para cada dependência (banco, cache, frete), custo alto para o prazo e a equipe; como a stack não será trocada, o jest.mock já dá o isolamento necessário. Testar só pela interface ou com banco de teste real: descartado como base porque é lento, depende do ambiente e não aponta qual regra quebrou; fica só para testes de integração, como o do ADR-003. Microkernel e Orientado a Eventos: não ajudam a testar a regra de negócio sem banco e acrescentariam complexidade.

## Rastreabilidade

**Atributo de qualidade:** Manutenibilidade · Testabilidade

**Cenário que originou a decisão:**

> Em ambiente de desenvolvimento, na máquina local, sem banco de dados e sem a API ligada, um desenvolvedor da equipe altera uma regra de negócio do backend, como a faixa permitida de estoque, e roda npm test. A suíte executa os casos do plano de testes sobre a camada de services e aponta pelo ID (ex.: TC09) qual regra quebrou, concluindo em até 1 minuto.

**Padrão arquitetural adotado:** Camadas

**Táticas empacotadas:** Encapsular responsabilidades por faixa; Restringir dependências a uma direção

backend/src/infrastructure/services/ (regras de negócio), backend/src/infrastructure/repositories/ (acesso a dados), backend/src/infrastructure/cache/ (Redis), backend/tests/services/ e backend/tests/controllers/ (testes unitários com jest.mock), docs/arquitetura.md; casos TC01, TC02, TC09, TC25, TC39, TC42, TC43, TC50 e TC51 do plano de testes; relacionado ao ADR 0001 (estoque), ao ADR-002 (cache) e ao ADR-003 (camadas e controle de acesso)

## Verificação

- **Teste do cenário:** Suíte Jest do backend (npm test na pasta backend), com repositories e cache substituídos por jest.mock, sem banco e sem a API ligada. O cenário passa se a suíte completa terminar em até 1 minuto (medido pelo tempo exibido pelo Jest) e, ao alterar uma regra de negócio de um service, o caso afetado falhar com o ID do plano de testes no nome (ex.: TC09 - Quantidade em estoque fora da faixa permitida). Execução de referência: 106 testes em cerca de 9 s.

---

_Gerado pelo estudo dirigido de Arquitetura de Software · ADS020 · 2026.2._
