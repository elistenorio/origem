# Fluxos implementados (Avaliação 1)

Os fluxos abaixo funcionam no navegador com os dados de exemplo (`frontend/src/dados-exemplo/`). As ações que mudam dados (remover do carrinho, cancelar pedido, editar estoque, aprovar na curadoria...) são simuladas em estado local da tela: funcionam na hora, mas não são salvas ao recarregar a página. Salvar dados de verdade é da Avaliação 2.

## Comprador

### 1. Descobrir peças
`/` (vitrine) → `/catalogo` → `/produto`

- A vitrine mostra peças e artesãos em destaque, com atalhos para o catálogo.
- No catálogo, a busca (também disponível no cabeçalho) e os filtros por categoria, técnica, material, região, faixa de preço e disponibilidade se combinam entre si. A ordenação é por relevância, menor preço, maior preço ou mais recentes.
- Filtros e página ficam na URL (`/catalogo?categoria=pintura&ordenar=menor_preco`). O link pode ser compartilhado e o botão "voltar" do navegador funciona.
- A lista mostra quantas peças foram encontradas, é paginada e tem estado vazio com a opção de limpar os filtros.

### 2. Conhecer os artesãos
`/artesaos` → `/artesaos/[id]`

- Lista de artesãos com busca e filtros por região, categoria e técnica.
- O perfil mostra a trajetória do artesão e o catálogo de peças dele.

### 3. Comprar (simulação)
`/carrinho` → `/checkout` → confirmação

- **Carrinho:** alterar a quantidade, remover itens, calcular o frete pelo CEP (PAC ou SEDEX; CEPs de Pernambuco pagam menos) e ver subtotal e total.
- **Checkout:** convite para entrar na conta ou seguir como visitante; dados pessoais, endereço e pagamento (cartão, Pix ou boleto), com validação dos campos obrigatórios, do CPF e dos dados do cartão.
- **Confirmação:** pop-up de "compra realizada" com o resumo do pedido.

### 4. Acompanhar pedidos
`/pedidos`

- Lista dos pedidos com status, itens, valores e rastreio.
- Cancelar um pedido (quando ainda está em preparo), informando o motivo.
- Avaliar um pedido entregue (nota por estrelas e comentário).

### 5. Conta
`/login`, `/cadastro`, `/cadastro/comprador`, `/cadastro/artesao`, `/minha-conta`

- Telas de login e de cadastro de comprador e de artesão. Os cadastros validam os campos; o do artesão é dividido em etapas e aceita anexos. Nesta fase, os dados não são enviados a um servidor.
- Minha conta mostra dados pessoais, endereço, pedidos recentes, formas de pagamento e preferências.

## Artesão

`/artesao/dashboard` → `/artesao/catalogo` → `/artesao/catalogo/nova` · `/artesao/catalogo/[id]` → `/artesao/estoque` · `/artesao/perfil`

- **Painel:** resumo do catálogo, notificações e pedidos recentes, com pop-up educativo e atalhos para catálogo e estoque.
- **Meu catálogo:** peças do artesão com status (publicada, em análise, indisponível...), ocultar ou reexibir uma peça, adicionar e editar.
- **Adicionar e editar peça:** formulário com fotos, descrição, técnica, material, medidas, preço e estoque.
- **Estoque:** contagem de disponíveis, baixo estoque e esgotadas, e edição da quantidade de cada peça.
- **Perfil:** edição dos dados de apresentação do artesão.

## Administrador

`/admin` e as seções `/admin/gestao`, `/admin/curadoria`, `/admin/acompanhamento`, `/admin/indicadores` e `/admin/visao-geral`

- **Início:** resumo da plataforma, pendências e atividades recentes.
- **Gestão:** tabelas de artesãos, clientes, produtos, pedidos, categorias e conteúdos, com a opção de suspender ou reativar um artesão.
- **Curadoria:** fila de artesãos e peças aguardando análise, com aprovar, recusar ou pedir ajustes.
- **Acompanhamento:** pedidos por status, alertas e cadastros recentes.
- **Indicadores e visão geral:** gráficos de vendas e números da plataforma.

## Institucional e ajuda

`/sobre`, `/newsletter`, `/ajuda/*` (como comprar, entregas e frete, formas de pagamento, trocas e devoluções, perguntas frequentes) e `/institucional/*` (termos de uso, política de privacidade, política de cookies, com painel de preferências de cookies).

## Limitações conhecidas

Pontos que ainda dependem da integração com a Fake API ou que estão em ajuste:

- **Página da peça:** a rota `/produto` ainda não recebe o id da peça e mostra sempre a mesma peça de exemplo.
- **Perfil do artesão:** `/artesaos/[id]` ainda mostra o mesmo artesão para qualquer id.
- **Carrinho e checkout:** cada tela usa a sua própria cópia do carrinho de exemplo, e o botão "Adicionar ao carrinho" ainda não adiciona. Isso se resolve com o store do carrinho, que vem com a Fake API.
- **Login:** o formulário ainda não entra em nenhuma conta. As áreas do artesão (`/artesao/dashboard`) e do administrador (`/admin`) são acessadas direto pela URL.
