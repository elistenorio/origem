"use client"

import NextLink from "next/link"
import { Button, Card, Heading, Image, Text } from "@chakra-ui/react"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { artesaosService } from "@/services/artesaos.service"

// "Sobre o artesão" na lateral da página da peça.
export function ArtisanAside({ artesaoId }: { artesaoId: string }) {
  const { data: artesao, loading, error, recarregar } = useApi(() => artesaosService.buscarPorId(artesaoId), [artesaoId])

  return (
    <Card.Root variant="origem" w={{ base: "full", lg: "420px" }} flexShrink={0} alignSelf="flex-start">
      <Card.Body gap="4">
        <Heading as="h2" variant="secao" fontSize="lg">Sobre o artesão</Heading>
        <DataState loading={loading} error={error} onRetry={recarregar} vazio={!artesao}>
          {artesao && (
            <>
              <Image src={artesao.fotoUrl} alt={artesao.nome} w="full" h="260px" objectFit="cover" borderRadius="xl" />
              <Heading as="h3" variant="titulo" fontSize="4xl" lineHeight="1">{artesao.nome}</Heading>
              <Text textStyle="rotulo">{artesao.oficio} · {artesao.cidade}, {artesao.estado}</Text>
              <Text lineClamp={8}>{artesao.historia}</Text>
              <Button asChild variant="origem">
                <NextLink href={`/artesaos/${artesao.id}`}>Conheça o artesão →</NextLink>
              </Button>
            </>
          )}
        </DataState>
      </Card.Body>
    </Card.Root>
  )
}
