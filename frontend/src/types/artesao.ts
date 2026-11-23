// Contrato de artesão: perfil PÚBLICO (o que o comprador vê).
// O formulário de cadastro fica em types/artisan-registration.ts.

export type StatusArtesao = "publicado" | "emAnalise" | "ajustesSolicitados" | "indisponivel" | "recusado"

export type Artesao = {
  id: string
  nome: string
  oficio: string        // ex.: "Ceramista"
  cidade: string
  estado: string        // UF
  regiao: string        // id de constants/regioes.ts
  bio: string           // resumo curto para o card
  historia: string      // texto longo do perfil; parágrafos separados por linha em branco ("\n\n")
  citacao: string
  // Seções da faixa laranja do perfil. Opcionais: a seção só aparece para quem tem o texto.
  trabalho?: string        // "Meu trabalho"
  origemTrabalho?: string  // "De onde vem o meu trabalho"
  citacaoOrigem?: string   // frase em destaque dessa seção
  gostaDeFazer?: string    // "O que gosto de fazer"
  fotoUrl: string
  tecnicas: string[]    // rótulos, ex.: ["Cerâmica", "Modelagem manual"]
  categorias: string[]  // ids de constants/categorias.ts
  totalProdutos: number
  email: string
  status: StatusArtesao
  criadoEm: string      // ISO 8601
}

// Perfil do artesão logado (GET /minha-conta/perfil): o público mais o que só ele vê.
export type PerfilArtesao = Artesao & {
  telefone: string
  tempoAtuacao: string  // "menos-1" | "1-3" | "3-10" | "mais-10", ou "" se ainda não preencheu
  parecerCuradoria?: string
}

// O que o artesão envia ao salvar o próprio perfil (PUT /minha-conta/perfil). O e-mail não muda por aqui.
export type PerfilArtesaoInput = {
  nome: string
  cidade: string
  estado: string        // UF, ex.: "PE"
  telefone: string
  historia: string
  trabalho: string
  origemTrabalho: string
  gostaDeFazer: string
  tempoAtuacao: string
  categorias: string[]  // ids de constants/categorias.ts ("Área de atuação")
  tecnicas: string[]    // rótulos, ex.: ["Modelagem manual"]
}

// Filtros da lista de artesãos (GET /artesaos). Todos opcionais.
export type FiltrosArtesao = {
  busca?: string
  regiao?: string
  categoria?: string
  tecnica?: string
  page?: number
  pageSize?: number
}

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

export type CadastroArtesaoInput = {
  aceitouTermos: boolean
  nome: string
  email: string
  senha: string
  telefone: string
  nomeArtistico: string
  oficio: string
  tempoAtuacao: string
  categoria: string
  tecnicas: string[]
  cidade: string
  estado: string
  regiao: string
  historia: string
  trabalho: string
  origemTrabalho: string
  gostaDeFazer: string
  comprovacoes: {
    possuiRegistro: boolean
    participouFeiras: boolean
    pertenceAssociacao: boolean
    associacao: string
    links: string[]
  }
}
