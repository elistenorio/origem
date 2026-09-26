"use client"

import NextLink from "next/link"
import { Flex, Heading, Link, SimpleGrid, Stack } from "@chakra-ui/react"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { artesaosService } from "@/services/artesaos.service"
import { ArtisanCard } from "./ArtisanCard"

// "Conheça quem faz": 4 artesãos na vitrine.
export function FeaturedArtisans() {
  const { data, loading, error, recarregar } = useApi(() => artesaosService.listar({ pageSize: 4 }), [])

  return (
    <Stack gap="6">
      <Flex justify="space-between" align="center" wrap="wrap" gap="2">
        <Heading as="h2" variant="secao" fontSize="xl">Conheça quem faz</Heading>
        <Link asChild variant="origem">
          <NextLink href="/artesaos">Ver todos os artesãos →</NextLink>
        </Link>
      </Flex>
      <DataState loading={loading} error={error} onRetry={recarregar} vazio={data?.items.length === 0} mensagemVazio="Nenhum artesão publicado ainda">
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="6">
          {data?.items.map((artesao) => <ArtisanCard key={artesao.id} artesao={artesao} />)}
        </SimpleGrid>
      </DataState>
    </Stack>
  )
}
