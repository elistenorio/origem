import NextLink from "next/link"
import { Flex, Heading, Link, SimpleGrid, Stack } from "@chakra-ui/react"
import { paraArtisan } from "@/dados-exemplo/adaptadores"
import { filtrarArtesaos } from "@/dados-exemplo/consultas"
import { ArtisanCard } from "./ArtisanCard"

// "Conheça quem faz": alguns artesãos na vitrine (dados de exemplo).
export function FeaturedArtisans() {
  const { items } = filtrarArtesaos({ pageSize: 4 })

  return (
    <Stack gap="6">
      <Flex justify="space-between" align="center" wrap="wrap" gap="2">
        <Heading as="h2" variant="secao" fontSize="xl">Conheça quem faz</Heading>
        <Link asChild variant="origem">
          <NextLink href="/artesaos">Ver todos os artesãos →</NextLink>
        </Link>
      </Flex>
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="6">
        {items.map((artesao) => <ArtisanCard key={artesao.id} artisan={paraArtisan(artesao)} />)}
      </SimpleGrid>
    </Stack>
  )
}
