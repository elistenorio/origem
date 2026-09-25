import NextLink from "next/link"
import { Badge, Button, Card, Heading, HStack, Image, Text } from "@chakra-ui/react"
import type { Artesao } from "@/types/artesao"

type ArtisanCardProps = {
  artesao: Pick<Artesao, "id" | "nome" | "cidade" | "estado" | "bio" | "fotoUrl" | "tecnicas">
}

// Card de listagem (vitrine e lista de artesãos). O perfil completo é a página /artesaos/[id].
export function ArtisanCard({ artesao }: ArtisanCardProps) {
  const { id, nome, cidade, estado, bio, fotoUrl, tecnicas } = artesao

  return (
    <Card.Root variant="vitrine" h="full">
      <Image src={fotoUrl} alt={nome} w="full" h="220px" objectFit="cover" />

      <Card.Body gap="2">
        <Heading as="h3" variant="titulo" size="xl">
          {nome}
        </Heading>
        <Text textStyle="rotulo">
          {cidade}, {estado}
        </Text>

        <HStack gap="2" wrap="wrap">
          {tecnicas.slice(0, 2).map((tecnica) => (
            <Badge key={tecnica}>{tecnica}</Badge>
          ))}
        </HStack>

        <Text lineClamp={3} flex="1">
          {bio}
        </Text>

        <Button asChild variant="origem" mt="2">
          <NextLink href={`/artesaos/${id}`}>Conheça o artesão →</NextLink>
        </Button>
      </Card.Body>
    </Card.Root>
  )
}
