"use client"

import { Box, Flex, Grid, Heading, Text, VStack, Image } from "@chakra-ui/react"
import { useParams } from "next/navigation"
import { ProductGrid } from "@/components/inicio/ProductGrid"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { artesaosService } from "@/services/artesaos.service"
import { produtosService } from "@/services/produtos.service"

// Perfil público do artesão (/artesaos/{id}): dados de GET /artesaos/{id} e as peças de GET /produtos?artesaoId={id}.
export default function PublicArtisanPage() {
  const { id } = useParams<{ id: string }>()
  const { data: artesao, loading, error, recarregar } = useApi(() => artesaosService.buscarPorId(id), [id])
  const { data: pecas, loading: carregandoPecas, error: erroPecas, recarregar: recarregarPecas } =
    useApi(() => produtosService.listar({ artesaoId: id }), [id])

  return (
    <Box pt={10}>
      {/* 404 não tem "tentar de novo": o artesão não existe ou o perfil não está publicado */}
      <DataState loading={loading} error={error} onRetry={error?.status === 404 ? undefined : recarregar}>
        {artesao && (
          <>
            {/* Top Section: Hero & Biography */}
            <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} mb={16}>
              <Flex flexDir={{ base: "column", lg: "row" }} gap={12} alignItems="stretch">

                {/* Artisan Photo */}
                <Box flex={{ base: "none", lg: "0 0 45%" }} position="relative" borderRadius="2xl" overflow="hidden" minH={{ base: "400px", md: "600px" }}>
                  <Image
                    src={artesao.fotoUrl}
                    alt={artesao.nome}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />

                  <VStack position="absolute" bottom={8} right={8} align="flex-end" gap={0}>
                    <Text color="origem.laranja" fontWeight="bold" fontSize="2xl" textTransform="uppercase" lineHeight="1">
                      {artesao.oficio}
                    </Text>
                    <Text color="origem.fundo" fontWeight="bold" fontSize="lg" textTransform="uppercase" letterSpacing="wide">
                      {artesao.cidade}, Pernambuco
                    </Text>
                  </VStack>
                </Box>

                {/* Artisan Bio */}
                <VStack flex="1" align="stretch" justify="center" gap={6}>
                  <Box>
                    <Text fontWeight="bold" fontSize="sm" color="origem.texto" textTransform="uppercase" mb={1}>
                      SOBRE O ARTESÃO
                    </Text>
                    <Heading variant="titulo" fontSize={{ base: "4xl", md: "5xl" }}>
                      {artesao.nome}
                    </Heading>
                  </Box>

                  <VStack align="stretch" gap={4} color="origem.texto" fontSize="md" lineHeight="1.7">
                    <Text fontStyle="italic" fontWeight="medium">
                      &ldquo;{artesao.citacao}&rdquo;
                    </Text>
                    {/* a história vem com os parágrafos separados por linha em branco */}
                    {artesao.historia.split("\n\n").map((paragrafo) => (
                      <Text key={paragrafo}>{paragrafo}</Text>
                    ))}
                  </VStack>
                </VStack>

              </Flex>
            </Box>

            {/* Middle Section: Detailed Info Strip */}
            <Box bg="origem.laranja" color="origem.fundo" py={16}>
              <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }}>
                <VStack align="stretch" gap={10}>

                  {/* As três seções abaixo só aparecem para quem tem o texto */}
                  {artesao.trabalho && (
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" mb={4}>MEU TRABALHO</Text>
                      <Text fontSize="sm" lineHeight="1.8">
                        {artesao.trabalho}
                      </Text>
                    </Box>
                  )}

                  {artesao.origemTrabalho && (
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" mb={4}>DE ONDE VEM O MEU TRABALHO</Text>
                      {artesao.citacaoOrigem && (
                        <Text fontStyle="italic" mb={2}>
                          &ldquo;{artesao.citacaoOrigem}&rdquo;
                        </Text>
                      )}
                      <Text fontSize="sm" lineHeight="1.8">
                        {artesao.origemTrabalho}
                      </Text>
                    </Box>
                  )}

                  {artesao.gostaDeFazer && (
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" mb={4}>O QUE GOSTO DE FAZER</Text>
                      <Text fontSize="sm" lineHeight="1.8">
                        {artesao.gostaDeFazer}
                      </Text>
                    </Box>
                  )}

                  <Box pt={4}>
                    <Text fontWeight="bold" fontSize="sm" textTransform="uppercase" mb={4}>PEÇA SOB ENCOMENDA. ENTRE EM CONTATO</Text>
                    <Grid templateColumns={{ base: "1fr 1fr", lg: "repeat(4, 1fr)" }} gap={6}>
                      <Box>
                        <Text fontSize="sm" mb={1}>WhatsApp</Text>
                        <Text fontSize="md" fontWeight="bold">(81) 90000-0000</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" mb={1}>Telefone</Text>
                        <Text fontSize="md" fontWeight="bold">(81) 0000-0000</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" mb={1}>Email</Text>
                        <Text fontSize="md" fontWeight="bold">contato@origem.com</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" mb={1}>Horário de Atendimento</Text>
                        <Text fontSize="md" fontWeight="bold">Segunda a Sábado - 09h00 às 19h30</Text>
                      </Box>
                    </Grid>
                  </Box>

                </VStack>
              </Box>
            </Box>

            {/* Bottom Section: Catalog Grid */}
            <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={16}>
              <Text fontWeight="bold" fontSize="lg" mb={8} textTransform="uppercase" color="origem.texto">
                MEU CATÁLOGO DE PEÇAS
              </Text>
              <DataState loading={carregandoPecas} error={erroPecas} onRetry={recarregarPecas} vazio={pecas?.items.length === 0} mensagemVazio="Nenhuma peça publicada ainda">
                {pecas && <ProductGrid produtos={pecas.items} />}
              </DataState>
            </Box>
          </>
        )}
      </DataState>
    </Box>
  )
}
