"use client"

import NextLink from "next/link"
import { Badge, Box, Button, Flex, Heading, HStack, Image, Link, Stack, Text } from "@chakra-ui/react"
import { BiEnvelope, BiGridAlt } from "react-icons/bi"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { Banner } from "@/components/common/Banner"
import { DataState } from "@/components/feedback/DataState"
import { EmptyMessage } from "@/components/feedback/EmptyMessage"
import { useApi } from "@/hooks/useApi"
import { artesaosService } from "@/services/artesaos.service"
import { ArtisanProducts } from "./ArtisanProducts"

// Perfil público do artesão (Tela 05): apresentação, encomendas e catálogo de peças.
export function ArtisanProfileView({ id }: { id: string }) {
  const { data: artesao, loading, error, recarregar } = useApi(() => artesaosService.buscarPorId(id), [id])

  if (error?.code === "NOT_FOUND") {
    return (
      <PageContainer>
        <EmptyMessage titulo="Artesão não encontrado" descricao="O perfil pode ter sido retirado da plataforma.">
          <Button asChild variant="origem">
            <NextLink href="/artesaos">Ver todos os artesãos</NextLink>
          </Button>
        </EmptyMessage>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <DataState loading={loading} error={error} onRetry={recarregar} vazio={!artesao}>
        {artesao && (
          <Stack gap={{ base: "12", md: "16" }}>
            <Flex gap={{ base: "8", lg: "14" }} direction={{ base: "column", lg: "row" }} align={{ base: "stretch", lg: "center" }}>
              <Box w={{ base: "full", lg: "500px" }} h={{ base: "400px", md: "560px", lg: "660px" }} flexShrink={0} borderRadius="2xl" overflow="hidden">
                <Image src={artesao.fotoUrl} alt={artesao.nome} w="full" h="full" objectFit="cover" />
              </Box>

              <Stack gap="5" flex="1" minW="0">
                <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Artesãos", href: "/artesaos" }, { label: artesao.nome }]} />
                <Stack gap="2">
                  <Text textStyle="rotulo">{artesao.oficio} · {artesao.cidade}, {artesao.estado}</Text>
                  <Heading as="h1" variant="titulo" fontSize={{ base: "4xl", md: "6xl" }} lineHeight="1">
                    {artesao.nome}
                  </Heading>
                </Stack>
                <HStack gap="2" wrap="wrap">
                  {artesao.tecnicas.map((tecnica) => (
                    <Badge key={tecnica}>{tecnica}</Badge>
                  ))}
                </HStack>
                <Text textStyle="destaqueLaranja" fontStyle="italic">&ldquo;{artesao.citacao}&rdquo;</Text>
                <Text>{artesao.historia}</Text>
                <Flex gap="3" direction={{ base: "column", sm: "row" }}>
                  <Button asChild variant="origem">
                    <a href="#catalogo"><BiGridAlt /> Ver catálogo</a>
                  </Button>
                  <Button asChild variant="claro">
                    <a href={`mailto:${artesao.email}`}><BiEnvelope /> Encomendar uma peça</a>
                  </Button>
                </Flex>
              </Stack>
            </Flex>

            <Banner tom="laranja" px={{ base: "6", md: "12" }} py={{ base: "8", md: "10" }}>
              <Stack gap="4">
                <Heading as="h2" variant="secao" fontSize="lg" color="inherit">Peça sob encomenda? Fale com {artesao.nome}</Heading>
                <Flex gap={{ base: "4", md: "12" }} direction={{ base: "column", md: "row" }}>
                  <Stack gap="0">
                    <Text>E-mail</Text>
                    <Link href={`mailto:${artesao.email}`} fontWeight="bold" color="inherit">{artesao.email}</Link>
                  </Stack>
                  <Stack gap="0">
                    <Text>Atendimento do Origem</Text>
                    <Text fontWeight="bold">Segunda a sábado, das 9h às 19h30</Text>
                  </Stack>
                </Flex>
              </Stack>
            </Banner>

            <ArtisanProducts artesaoId={artesao.id} />
          </Stack>
        )}
      </DataState>
    </PageContainer>
  )
}
