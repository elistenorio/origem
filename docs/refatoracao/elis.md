# Revisão de code smells — Elis Tenório: decisão de não refatorar

Parte analisada: regras de validação dos formulários do frontend (cadastro de comprador e checkout). A parte refatorada está nos commits `70d35b2` e `4f33e93`; este arquivo registra a parte que decidi não refatorar.

## 1. Code smell: Duplicated Code entre frontend e backend

As regras de validação de e-mail e de senha estão implementadas duas vezes, uma em cada pacote.

| Regra | Frontend | Backend |
|---|---|---|
| E-mail válido (`emailValido`) | `frontend/src/utils/validation.ts:5` | `backend/src/shared/validacao.ts:8` |
| Tamanho mínimo da senha (`SENHA_TAMANHO_MINIMO`) | `frontend/src/utils/validation.ts:3` | `backend/src/shared/validacao.ts:42` |

**Impactos:**
- **Legibilidade e coesão:** não são afetadas. Cada cópia é curta, tem nome próprio e está no módulo de validação do seu pacote.
- **Acoplamento:** há um acoplamento implícito. As cópias precisam ser equivalentes, mas nada no código garante isso.
- **Manutenibilidade:** alterar uma regra exige mudar os dois pacotes (Shotgun Surgery). Isso já causou uma divergência: o frontend aceitava `a@b` e o backend recusava. A divergência foi corrigida no commit `4f33e93`.
- **Extensibilidade:** cada nova regra validada nos dois lados cria mais um par de cópias.

## 2. Decisão: não refatorar

Frontend e backend são pacotes independentes, com builds e deploys separados (Vercel e Render), e não compartilham código. As duas validações também têm papéis diferentes:
- a do frontend dá feedback imediato ao usuário;
- a do backend garante a integridade dos dados, já que o servidor não pode confiar no cliente.

Validar nos dois lados é uma boa prática, e a duplicação da regra é o custo dela.

**Alternativas avaliadas:**
- **Pacote compartilhado (monorepo com npm workspaces):** exige reestruturar o repositório e reconfigurar o build e o deploy dos dois pacotes.
- **O frontend importar o arquivo do backend:** acopla os dois pacotes e exige configuração extra no build do Next.
- **Validar só no backend:** o usuário só recebe o erro depois de enviar o formulário.
- **O backend expor as regras numa rota:** cria uma requisição e um contrato novos só para validar um formulário.

O que se repete são duas regras pequenas e estáveis: uma constante e uma regex. Todas as alternativas trazem uma mudança estrutural, desproporcional ao problema. Por isso, manter a duplicação de forma controlada é a decisão mais adequada neste momento.

## 3. Riscos e limitações

- **Risco aceito:** as regras voltarem a divergir.
- **Mitigações:**
  - há um único ponto de definição em cada pacote;
  - um comentário em cada lado aponta para o outro;
  - o `frontend/tests/utils/validation.test.ts` (roda com `npm test`) falha se a regra do frontend mudar sem intenção.
- **Impacto de uma divergência:** é limitado. O backend sempre valida, então nenhum dado inválido é persistido.
- **Limitação:** o comentário em `backend/src/shared/validacao.ts:41` ainda cita o `BuyerRegisterForm`. Não alterei porque o backend ficou fora do escopo.
- **Quando revisar:** se o projeto adotar um pacote compartilhado, ou se mais regras passarem a ser validadas nos dois lados.
