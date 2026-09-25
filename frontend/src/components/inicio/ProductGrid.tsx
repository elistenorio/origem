import NextLink from "next/link"
import { LinkBox, LinkOverlay, SimpleGrid, VisuallyHidden } from "@chakra-ui/react"
import { ProductCard } from "./ProductCard"
import type { Produto } from "@/types/produto"

type ProductGridProps = {
  produtos: Produto[]
  colunas?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number }
}

// Grade de cards de peças (vitrine, catálogo, perfil do artesão). O card inteiro leva para a página da peça.
export function ProductGrid({ produtos, colunas = { base: 1, sm: 2, lg: 4 } }: ProductGridProps) {
  return (
    <SimpleGrid columns={colunas} gap="6">
      {produtos.map((produto) => (
        <LinkBox key={produto.id}>
          <ProductCard produto={produto} />
          <LinkOverlay asChild>
            <NextLink href={`/produto/${produto.id}`}>
              <VisuallyHidden>Ver {produto.titulo}</VisuallyHidden>
            </NextLink>
          </LinkOverlay>
        </LinkBox>
      ))}
    </SimpleGrid>
  )
}
