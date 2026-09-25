"use client"

import NextLink from "next/link"
import { Flex, Heading, Link, Stack } from "@chakra-ui/react"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { produtosService } from "@/services/produtos.service"
import { ProductGrid } from "./ProductGrid"

// "Peças em destaque" da vitrine: as mais recentes publicadas.
export function FeaturedProducts() {
  const { data, loading, error, recarregar } = useApi(() => produtosService.listar({ ordenar: "recentes", pageSize: 8 }), [])

  return (
    <Stack gap="6">
      <Flex justify="space-between" align="center" wrap="wrap" gap="2">
        <Heading as="h2" variant="secao" fontSize="xl">Peças em destaque</Heading>
        <Link asChild variant="origem">
          <NextLink href="/catalogo">Ver catálogo completo →</NextLink>
        </Link>
      </Flex>
      <DataState loading={loading} error={error} onRetry={recarregar} vazio={!data?.items.length} mensagemVazio="Nenhuma peça publicada ainda">
        {data && <ProductGrid produtos={data.items} />}
      </DataState>
    </Stack>
  )
}
