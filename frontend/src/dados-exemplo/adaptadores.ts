import type { Artisan } from "@/types/artisan"
import type { Product } from "@/types/product"
import type { Artesao } from "@/types/artesao"
import type { Produto } from "@/types/produto"

// Converte os dados de exemplo para os tipos que ProductCard e ArtisanCard já recebem.
export const paraProduct = (p: Produto): Product => ({
  id: p.id,
  title: p.titulo,
  tags: p.tags,
  artisan: p.artesaoNome,
  artisanId: p.artesaoId,
  city: p.cidade,
  dimensions: p.medidas,
  price: p.preco,
  imageUrl: p.imagemUrl,
})

export const paraArtisan = (a: Artesao): Artisan => ({
  id: a.id,
  name: a.nome,
  city: a.cidade,
  region: a.estado,
  bio: a.bio,
  avatarUrl: a.fotoUrl,
  techniques: a.tecnicas,
  productCount: a.totalProdutos,
})
