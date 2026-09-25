// Tipos das telas enquanto a Fake API não chega (dados estáticos de exemplo).
// Ao integrar com a Fake API, trocar pelos tipos de src/types e apagar esta pasta.

// ---- produto
// Produto: entidade central da vitrine. Mesmo tipo na Fake API, nos services e nos componentes.

// Situação da peça no catálogo do artesão (as chaves batem com o StatusBadge).
export type StatusProduto = "publicado" | "emAnalise" | "rascunho" | "indisponivel" | "vendida"

export type Produto = {
  id: string
  titulo: string
  artesaoId: string
  artesaoNome: string   // ex.: "Mestre Joãozinho" (para exibir no card)
  cidade: string        // ex.: "Tracunhaém"
  tags: string[]        // ex.: ["Peça única", "Barro"]
  medidas: string       // ex.: "15 × 27 × 15cm"
  preco: number         // em reais, ex.: 167.9
  imagemUrl: string
  categoria: string     // id de constants/categorias.ts
  tecnica: string       // id de constants/tecnicas.ts
  material: string      // id de constants/materiais.ts
  regiao: string        // id de constants/regioes.ts
  estoque: number
  pecaUnica: boolean
  status: StatusProduto
  criadoEm: string      // ISO 8601
}

// Página de detalhe: tudo do card + o que só aparece no detalhe.
export type ProdutoDetalhe = Produto & {
  descricao: string
  cuidados: string
  imagens: string[]     // galeria (a primeira é a capa)
}

export type OrdenacaoProduto = "relevancia" | "menor_preco" | "maior_preco" | "recentes"

// Filtros da vitrine. Todos opcionais; combinam entre si (E lógico).
export type FiltrosProduto = {
  busca?: string        // título, técnica, material, artesão
  categoria?: string
  tecnica?: string
  material?: string
  regiao?: string
  precoMin?: number
  precoMax?: number
  disponivel?: "sim"    // só peças com estoque
  artesaoId?: string
  ordenar?: OrdenacaoProduto
  page?: number
  pageSize?: number
}

// O que o artesão envia ao criar ou editar uma peça.
export type ProdutoInput = {
  titulo: string
  categoria: string
  descricao: string
  material: string
  tecnica: string
  altura: string
  largura: string
  profundidade: string
  peso: string
  pecaUnica: boolean
  estoque: number
  preco: number
  prazoPostagem: string
  embalagem: string
  cuidadosEnvio: string
  enviarParaAnalise: boolean // false = salvar como rascunho
}

// ---- artesao
// Perfil PÚBLICO do artesão (o que o comprador vê).
// O formulário de cadastro fica em types/artisan-registration.ts.

export type StatusArtesao = "publicado" | "emAnalise" | "ajustesSolicitados" | "indisponivel"

export type Artesao = {
  id: string
  nome: string
  oficio: string        // ex.: "Ceramista"
  cidade: string
  estado: string        // UF
  regiao: string        // id de constants/regioes.ts
  bio: string           // resumo curto para o card
  historia: string      // texto longo do perfil
  citacao: string
  fotoUrl: string
  tecnicas: string[]    // rótulos, ex.: ["Cerâmica", "Modelagem manual"]
  categorias: string[]  // ids de constants/categorias.ts
  totalProdutos: number
  email: string
  status: StatusArtesao
  criadoEm: string      // ISO 8601
}

export type FiltrosArtesao = {
  busca?: string
  regiao?: string
  categoria?: string
  tecnica?: string
  page?: number
  pageSize?: number
}

// ---- carrinho

// Carrinho vive no cliente na Avaliação 1 (Zustand + localStorage).
// Totais e contagem são calculados a partir dos itens, não guardados.
export type ItemCarrinho = {
  produto: Produto
  quantidade: number
}

// ---- frete
export type ModalidadeFrete = "pac" | "sedex"

export type OpcaoFrete = {
  modalidade: ModalidadeFrete
  nome: string          // ex.: "PAC"
  valor: number
  prazo: string         // ex.: "6 a 8 dias úteis"
}

// ---- pedido

export type StatusPedido = "processando" | "emSeparacao" | "enviado" | "entregue" | "cancelado"

export type FormaPagamento = "cartao" | "pix" | "boleto"

export type Endereco = {
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

export type Comprador = {
  nome: string
  cpf: string
  email: string
  telefone: string
}

// O que o front ENVIA em POST /pedidos
export type CriarPedidoInput = {
  itens: { produtoId: string; quantidade: number }[]
  comprador: Comprador
  endereco: Endereco
  frete: ModalidadeFrete
  pagamento: FormaPagamento
  parcelas: number
}

export type ItemPedido = {
  produtoId: string
  titulo: string        // "foto" do momento da compra
  imagemUrl: string
  artesaoNome: string
  precoUnitario: number // preço não muda depois do pedido
  quantidade: number
}

export type EventoPedido = {
  titulo: string        // ex.: "Pagamento confirmado"
  data: string          // ISO 8601
}

// O que a API DEVOLVE
export type Pedido = {
  id: string
  codigo: string        // ex.: "#10495"
  status: StatusPedido
  criadoEm: string
  itens: ItemPedido[]
  subtotal: number
  frete: { modalidade: ModalidadeFrete; valor: number; prazo: string }
  total: number
  comprador: Comprador
  endereco: Endereco
  pagamento: FormaPagamento
  parcelas: number
  codigoRastreio?: string
  previsaoEntrega?: string
  eventos: EventoPedido[]
  avaliado: boolean
  motivoCancelamento?: string
}

export type CancelarPedidoInput = {
  motivo: string
  observacao?: string
}

// ---- avaliacao
export type NotasAvaliacao = {
  produto?: number
  embalagem?: number
  entrega?: number
}

// O que o front ENVIA em POST /avaliacoes
export type CriarAvaliacaoInput = {
  pedidoId: string
  nota: number          // 1 a 5
  comentario: string
  notas: NotasAvaliacao
}

export type Avaliacao = CriarAvaliacaoInput & {
  id: string
  criadoEm: string
}

// ---- usuario
export type PerfilUsuario = "comprador" | "artesao" | "admin"

export type StatusUsuario = "ativo" | "suspenso"

export type Usuario = {
  id: string
  nome: string
  email: string
  perfil: PerfilUsuario
  status: StatusUsuario
  cidade: string
  criadoEm: string
}

// O que o front ENVIA em POST /usuarios (cadastro do comprador).
// Na Avaliação 1 o cadastro é simulado; autenticação real vem na Avaliação 2.
export type CadastroCompradorInput = {
  nome: string
  email: string
  senha: string
}

// ---- newsletter
export type InscricaoNewsletterInput = {
  nome: string
  email: string
  consentimento: boolean
}

export type InscricaoNewsletter = {
  nome: string
  email: string
  inscritoEm: string
}

// ---- painel-artesao
// Números do painel do artesão logado (catálogo e estoque).
export type ResumoPainelArtesao = {
  catalogo: {
    publicadas: number
    emAnalise: number
    vendidas: number
    indisponiveis: number
  }
  estoque: {
    disponiveis: number
    baixoEstoque: number   // 1 unidade ou menos
    esgotadas: number
  }
}

export type AtualizarEstoqueInput = {
  estoque?: number
  status?: "indisponivel" | "publicado"
}

// ---- admin

export type PeriodoIndicadores = "7d" | "30d" | "12m"

export type ResumoPlataforma = {
  pedidosHoje: number
  vendasMes: number
  artesaosAtivos: number
  produtosPublicados: number
  clientes: number
}

export type Pendencia = {
  id: string
  titulo: string
  quantidade: number
  href: string
}

export type Atividade = {
  id: string
  autor: string
  descricao: string
  data: string           // ISO 8601
}

export type Indicadores = {
  periodo: PeriodoIndicadores
  faturamento: number
  pedidos: number
  ticketMedio: number
  pecasVendidas: number
  artesaosAtivos: number
  clientes: number
  produtosPublicados: number
  visualizacoes: number
  variacoes: Record<"faturamento" | "pedidos" | "ticketMedio" | "pecasVendidas", number> // % vs período anterior
  faturamentoMensal: { mes: string; atual: number; anterior: number }[]
  vendasPorCategoria: { categoria: string; quantidade: number }[]
  pedidosPorSemana: { semana: string; quantidade: number }[]
}

export type PainelAdmin = {
  resumo: ResumoPlataforma
  pendencias: Pendencia[]
  notificacoes: { id: string; titulo: string; descricao: string }[]
  atividades: Atividade[]
}

export type Acompanhamento = {
  contagem: Record<"processando" | "enviado" | "entregue" | "cancelado", number>
  alertas: { id: string; titulo: string; descricao: string; gravidade: "alta" | "media" }[]
  artesaosRecentes: Artesao[]
  produtosPendentes: Produto[]
  atividades: Atividade[]
}

export type TipoCuradoria = "artesaos" | "pecas"

export type ItemCuradoria = {
  id: string
  tipo: TipoCuradoria
  titulo: string          // nome do candidato ou da peça
  subtitulo: string       // cidade/técnica ou artesão
  enviadoEm: string
  imagemUrl: string
  fotos: string[]
  descricao: string
  trajetoria?: string
  documentos: { nome: string; tamanho: string }[]
  historico: { titulo: string; data: string }[]
}

export type DecisaoCuradoria = "aprovar" | "ajustes" | "recusar"

export type DecidirCuradoriaInput = {
  decisao: DecisaoCuradoria
  parecer: string
}

// ---- checkout

// Dados do formulário de checkout (estado da tela). Os dados do cartão
// não são enviados na Avaliação 1: o pagamento real entra na Avaliação 2.
export type DadosCheckout = Comprador &
  Endereco & {
    pagamento: FormaPagamento
    parcelas: string
    numeroCartao: string
    nomeCartao: string
    validade: string
    cvv: string
  }

export type ErrosCheckout = Partial<Record<keyof DadosCheckout, string>>
