# Revisão de code smell: cadastro do artesão

**Integrante:** Eulália R. S. de Albuquerque
**Código analisado:** `frontend/src/types/artisan-registration.ts` e `frontend/src/components/cadastro/`

## Code smell identificado

Large Class (categoria Bloaters), com traço de Data Class (categoria Dispensables). O tipo `ArtisanRegistrationData` reúne 27 campos das cinco etapas do cadastro de artesão (identificação, perfil, trajetória, comprovações e fotos) num único objeto plano. A separação entre etapas existe apenas em comentários (`// etapa 1` a `// etapa 5`), e todas as etapas recebem o objeto inteiro por meio de `StepProps`. O tipo só guarda dados: a validação de cada etapa fica espalhada nos componentes (por exemplo, `senhasDiferentes` em `StepIdentification`).

## Impactos

- Coesão baixa: credenciais de acesso, perfil artístico, comprovações e arquivos de foto no mesmo tipo.
- Acoplamento: cada etapa depende do formulário inteiro, embora use apenas a própria fatia (a etapa de fotos recebe a senha).
- Manutenibilidade: saber a qual etapa um campo pertence depende de ler comentários, sem ajuda do compilador.
- Extensibilidade: novos campos ou etapas aumentam ainda mais o tipo.

## Alternativas consideradas

1. Extract Class: subtipos por etapa (`IdentificacaoData`, `PerfilData`, `TrajetoriaData`, `ComprovacoesData`, `FotosData`), compostos em `ArtisanRegistrationData`.
2. Estado separado por etapa no wizard (`useState` por etapa ou `useReducer`).
3. Manter o tipo plano e registrar a decisão.

## Decisão: não refatorar

A refatoração seria especulativa. O backend ainda não tem a rota de cadastro de artesão, e o formato dos subtipos depende do contrato que essa rota vai exigir (por exemplo, se as fotos serão enviadas separadamente). Dividir o tipo agora traz risco de retrabalho.

O tipo plano é adequado ao uso atual, que é o estado de um formulário controlado em React. É ele que permite um `handleChange` genérico e tipado (`K extends keyof ArtisanRegistrationData`), em que o compilador impede atribuir valor de tipo errado a qualquer campo. Com tipos aninhados, o tratamento de alterações ficaria mais complexo sem ganho funcional.

O custo atual de manter é baixo: o arquivo é curto, tipado e com as fronteiras de etapa documentadas. Já o custo de alterar é alto: sete arquivos afetados, sem testes automatizados no projeto para garantir que o fluxo continua igual.

## Riscos e limitações

- O acoplamento entre as etapas e o formulário completo permanece.
- Se novos campos forem adicionados antes da integração com a API, a refatoração futura fica mais cara.

## Gatilho para revisar

Reavaliar quando a rota de cadastro de artesão for implementada no backend, quando cada etapa precisar de validação própria, ou quando surgir uma nova etapa. Nesse momento, a alternativa recomendada é a 1 (Extract Class, com subtipos por etapa alinhados ao contrato da API).
