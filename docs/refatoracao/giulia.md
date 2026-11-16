# Revisão de code smells — Giulia Ferreira

Parte analisada: página de detalhe do produto, `frontend/src/app/(main)/produtos/[id]/page.tsx`.
Base da análise: branch `main`, commit `3ba17fd`.

## 1. Smell principal: Large Component / Long Method

### Onde está
`ProdutoDetailPage` tinha 229 linhas, sendo cerca de 170 de JSX num único `return`. Era o maior componente do frontend.

O mesmo componente:
- fazia três buscas à API (peça, peças relacionadas e artesão);
- guardava o estado da compra (`quantidade`, `adicionado`) e falava com o carrinho e com o roteador;
- desenhava a galeria, o painel de compra, a ficha técnica, o artesão, os cuidados, a entrega, as trocas e as peças relacionadas.

O próprio código se dividia por comentários (`Top Section`, `Left: Product Images`, `Right: Product Actions`, `Middle Section`, `Bottom Section`). Comentário usado para separar blocos é o sinal clássico de que cada bloco pede um nome próprio.

### Impactos
- **Legibilidade:** para entender o botão "Adicionar ao carrinho" era preciso atravessar a galeria e os textos de entrega.
- **Coesão:** busca de dados, regra de compra e layout no mesmo lugar. Isso contraria a regra do próprio projeto (`frontend/CLAUDE.md`): "`page.tsx` só monta a tela".
- **Manutenibilidade:** qualquer ajuste visual mexia no arquivo que também controla as buscas. Duas pessoas trabalhando na tela entravam em conflito no mesmo arquivo.
- **Extensibilidade:** funcionalidades previstas (zoom na galeria, avaliações da peça) aumentariam ainda mais o componente.
- **Testabilidade:** não dava para testar o painel de compra sem simular as três chamadas à API.

### Decisão: refatorar (Extract Component)
A refatoração é barata (mover JSX, sem mudar regra) e a tela é central para o comprador, então tende a crescer.

| Antes | Depois |
|---|---|
| `page.tsx` com 229 linhas | `page.tsx` com 52 linhas: só buscas e composição |
| | `components/produto/ProductGallery.tsx` (29 linhas): miniaturas e capa |
| | `components/produto/ProductPurchasePanel.tsx` (98 linhas): preço, estoque, quantidade, frete e carrinho |
| | `components/produto/ProductInfoSections.tsx` (93 linhas): ficha técnica, artesão, cuidados, entrega e trocas |

Escolhas feitas:
- **As buscas ficaram na página.** Os componentes recebem os dados por props tipadas (`Produto`, `Artesao`) e não conhecem os services. Segue o fluxo do projeto: página → hook → service.
- **O estado da compra desceu para o painel.** `quantidade` e `adicionado` só eram usados ali; a página não precisa mais saber deles.
- **A galeria recebe só três campos** (`titulo`, `imagemUrl`, `imagens`), não o produto inteiro, para depender do mínimo.
- **O JSX foi movido sem alterações:** mesmos textos, tokens do tema e props responsivas.

Alternativas descartadas:
- *Um componente por seção de texto* (cinco arquivos pequenos): fragmentaria demais blocos que são só texto e sempre aparecem juntos.
- *Hook `useProdutoDetalhe` para as três buscas:* a página ficou com 52 linhas e as buscas são o papel dela; o hook seria uma camada a mais sem ganho hoje.

### Validação
- `npm run lint` e `npm run build` passam depois da refatoração.
- O projeto não tem framework de testes, então não há teste automatizado. A conferência do comportamento é manual: abrir `/produtos/{id}`, comparar a tela com a da `main`, alterar a quantidade, adicionar ao carrinho e comprar agora.

### Riscos e limitações
- Sem testes de componente, uma regressão visual só é percebida olhando a tela.
- Como o estado agora vive no painel, ele volta ao valor inicial se o painel for desmontado (por exemplo, ao recarregar os dados da peça). No fluxo atual isso só acontece ao trocar de peça, quando zerar a quantidade é o esperado.
- A função `rotulo` foi movida junto com a ficha técnica para `ProductInfoSections.tsx`. Ela é a mesma duplicação tratada pela Sarah (extração de `rotuloDe`); quando a refatoração dela entrar, a troca passa a ser feita nesse arquivo.

## 2. Smell associado: textos de política fixos no componente

### Onde está
"Até 12x sem juros" e "5% de desconto" (agora em `ProductPurchasePanel.tsx`) e "até 3 dias úteis" (agora em `ProductInfoSections.tsx`) estão escritos direto no JSX.

### Decisão: não refatorar agora
A suspeita era de duplicação com as páginas de ajuda, que justificaria uma constante compartilhada. Conferindo o código, ela não se confirma:

- "12x sem juros" e "5% de desconto" aparecem **só** na página de produto. Não há segunda cópia para divergir.
- "3 dias úteis" aparece em outros arquivos, mas com significados diferentes: prazo de postagem (`ajuda/entregas-e-frete`, `ProductForm`) e compensação de boleto (`ajuda/formas-de-pagamento`, `PaymentFields`). Uma constante única juntaria regras que só coincidem no número e passaria a ideia errada de que mudam juntas.
- Esses valores são regra de negócio. O lugar definitivo deles é o backend (parcelamento e desconto no pagamento; prazo de postagem informado pelo artesão em cada peça), que ainda não expõe esses dados. Criar uma constante no frontend agora seria uma abstração provisória, a ser desfeita depois.
- O texto continua fácil de achar: está num componente pequeno e com nome claro, que é resultado da refatoração do item 1.

Risco assumido: se a política de pagamento mudar antes de vir da API, é preciso lembrar de editar o painel de compra.

Gatilho para revisar: quando o backend passar a devolver condições de pagamento ou o prazo de postagem da peça, ou quando um segundo ponto da interface precisar exibir os mesmos valores.
