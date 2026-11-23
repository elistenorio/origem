# Arquitetura

## Testes

Os testes unitários do backend ficam em `backend/tests/` e rodam com Jest (`npm test`). Eles cobrem as regras de negócio dos services (pedidos, avaliações, login e cadastro), as validações dos controllers e os middlewares de autenticação, perfil e erros. Cada `describe` leva o ID do caso do plano de testes (ex.: "TC09 - Quantidade em estoque fora da faixa permitida (HU-030, Cenários 3 e 4)"), para a saída do `npm test` mostrar os mesmos casos do documento. O banco não é usado: o service roda de verdade e o repository e o cache são trocados por funções falsas com `jest.mock`, que devolvem o que cada teste precisa. Assim o teste verifica só a regra de negócio. Disputas reais entre duas compras pela mesma peça dependem do banco e ficam para testes de integração. O teste do ADR-003 (`npm run test:acesso`) é diferente: chama a API já ligada, com o seed aplicado.
