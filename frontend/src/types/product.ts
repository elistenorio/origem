// Product: o que já existia, com UMA adição (artisanId), para ligar o card ao perfil.
export type Product = {
  id: string
  title: string
  tags: string[]        // ex.: ["Peça única", "Barro"]
  artisan: string       // ex.: "Mestre Joãozinho" (nome, para exibir no card)
  artisanId: string     // NOVO: para linkar /artesao/[id]
  city: string          // ex.: "Tracunhaém"
  dimensions: string    // ex.: "15 × 27 × 15cm"
  price: number         // ex.: 167.9
  imageUrl: string
}

// Página de detalhe: tudo do card + o que só aparece no detalhe.
export type ProductDetail = Product & {
  description: string
  category: string      // ex.: "Cerâmica"
  technique: string     // ex.: "Barro modelado"
  region: string        // ex.: "Zona da Mata"
  stock: number
  images: string[]      // galeria
}

// Filtros da vitrine. Todos opcionais; combinam entre si (E lógico).
export type ProductFilters = {
  q?: string            // busca livre por título, técnica, tag
  category?: string
  technique?: string
  region?: string
  page?: number
  pageSize?: number
  sort?: "recent" | "price_asc" | "price_desc"
}

// Opções para montar os controles de filtro.
export type FilterOptions = {
  categories: string[]
  techniques: string[]
  regions: string[]
}
