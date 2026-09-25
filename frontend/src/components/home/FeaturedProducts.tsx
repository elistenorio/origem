import NextLink from "next/link"
import { Flex, Heading, Link, Stack } from "@chakra-ui/react"
import { filtrarProdutos } from "@/dados-exemplo/consultas"
import { ProductGrid } from "./ProductGrid"

// "Peças em destaque" da vitrine: as mais recentes publicadas (dados de exemplo).
export function FeaturedProducts() {
  const { items } = filtrarProdutos({ status: "publicado", ordenar: "recentes", pageSize: 8 })

  return (
    <Stack gap="6">
      <Flex justify="space-between" align="center" wrap="wrap" gap="2">
        <Heading as="h2" variant="secao" fontSize="xl">Peças em destaque</Heading>
        <Link asChild variant="origem">
          <NextLink href="/catalogo">Ver catálogo completo →</NextLink>
        </Link>
      </Flex>
      <ProductGrid produtos={items} />
    </Stack>
  )
}
