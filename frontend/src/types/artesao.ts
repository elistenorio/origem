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
