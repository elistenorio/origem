// Contrato de artesão: perfil PÚBLICO (o que o comprador vê).
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
