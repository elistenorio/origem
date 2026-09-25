"use client"

import NextLink from "next/link"
import { Button, Flex, Heading, Stack } from "@chakra-ui/react"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { ProductGrid } from "@/components/inicio/ProductGrid"
import { DataState } from "@/components/feedback/DataState"
import { EmptyMessage } from "@/components/feedback/EmptyMessage"
import { useApi } from "@/hooks/useApi"
import { produtosService } from "@/services/produtos.service"
import { ProductGallery } from "./ProductGallery"
import { ProductPurchasePanel } from "./ProductPurchasePanel"
import { ProductDetails } from "./ProductDetails"
import { ArtisanAside } from "./ArtisanAside"

// Página da peça (Tela 04): galeria e compra, detalhes, artesão e peças relacionadas.
export function ProductDetailView({ id }: { id: string }) {
  const { data: produto, loading, error, recarregar } = useApi(() => produtosService.buscarPorId(id), [id])
  const relacionados = useApi(() => produtosService.relacionados(id), [id])

  if (error?.code === "NOT_FOUND") {
    return (
      <PageContainer>
        <EmptyMessage titulo="Peça não encontrada" descricao="Ela pode ter sido vendida ou retirada do catálogo.">
          <Button asChild variant="origem">
            <NextLink href="/catalogo">Ver o catálogo</NextLink>
          </Button>
        </EmptyMessage>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <DataState loading={loading} error={error} onRetry={recarregar} vazio={!produto}>
        {produto && (
          <Stack gap={{ base: "10", md: "16" }}>
            <Stack gap="6">
              <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Catálogo", href: "/catalogo" }, { label: produto.titulo }]} />
              <Flex gap="10" direction={{ base: "column", lg: "row" }} align="flex-start">
                <ProductGallery titulo={produto.titulo} imagens={produto.imagens} />
                <ProductPurchasePanel produto={produto} />
              </Flex>
            </Stack>

            <Flex gap="12" direction={{ base: "column", lg: "row" }} align="flex-start">
              <ProductDetails produto={produto} />
              <ArtisanAside artesaoId={produto.artesaoId} />
            </Flex>

            {!!relacionados.data?.length && (
              <Stack gap="6">
                <Heading as="h2" variant="secao" fontSize="lg">Peças relacionadas</Heading>
                <ProductGrid produtos={relacionados.data} />
              </Stack>
            )}
          </Stack>
        )}
      </DataState>
    </PageContainer>
  )
}
