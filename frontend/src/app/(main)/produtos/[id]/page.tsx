"use client"

import { Box, Flex, Text } from "@chakra-ui/react"
import { useParams } from "next/navigation"
import { ProductGrid } from "@/components/inicio/ProductGrid"
import { DataState } from "@/components/feedback/DataState"
import { ProductGallery } from "@/components/produto/ProductGallery"
import { ProductInfoSections } from "@/components/produto/ProductInfoSections"
import { ProductPurchasePanel } from "@/components/produto/ProductPurchasePanel"
import { useApi } from "@/hooks/useApi"
import { artesaosService } from "@/services/artesaos.service"
import { produtosService } from "@/services/produtos.service"

// Detalhe da peça (/produtos/{id}): dados de GET /produtos/{id}, do artesão e das peças relacionadas.
// A página só busca os dados e monta a tela; cada bloco visual é um componente de components/produto/.
export default function ProdutoDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: produto, loading, error, recarregar } = useApi(() => produtosService.buscarPorId(id), [id])
  const { data: relacionados, loading: carregandoRelacionados, error: erroRelacionados, recarregar: recarregarRelacionados } =
    useApi(() => produtosService.relacionados(id), [id])
  // "Sobre o artesão": só aparece se o perfil estiver publicado (senão a API responde 404 e a seção mostra só o nome).
  const artesaoId = produto?.artesaoId
  const { data: artesao } = useApi(async () => (artesaoId ? artesaosService.buscarPorId(artesaoId) : undefined), [artesaoId])

  return (
    <Box maxW="container.xl" mx="auto" p={{ base: 4, md: 8 }} mt={4}>
      {/* 404 não tem "tentar de novo": a peça não existe ou não está publicada */}
      <DataState loading={loading} error={error} onRetry={error?.status === 404 ? undefined : recarregar}>
        {produto && (
          <>
            <Flex flexDir={{ base: "column", lg: "row" }} gap={10} mb={16}>
              <ProductGallery titulo={produto.titulo} imagemUrl={produto.imagemUrl} imagens={produto.imagens} />
              <ProductPurchasePanel produto={produto} />
            </Flex>

            <Flex flexDir={{ base: "column", lg: "row" }} gap={10} mb={20}>
              <ProductInfoSections produto={produto} artesao={artesao} />
            </Flex>

            <Box mb={10}>
              <Text fontWeight="bold" fontSize="lg" mb={6} textTransform="uppercase">PEÇAS RELACIONADAS</Text>
              <DataState loading={carregandoRelacionados} error={erroRelacionados} onRetry={recarregarRelacionados} vazio={relacionados?.length === 0} mensagemVazio="Nenhuma peça relacionada">
                {relacionados && <ProductGrid produtos={relacionados} />}
              </DataState>
            </Box>
          </>
        )}
      </DataState>
    </Box>
  )
}
