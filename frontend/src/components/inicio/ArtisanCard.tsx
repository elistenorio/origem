import NextLink from "next/link"
import { Badge, Box, Button, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react"
import type { Artesao } from "@/types/artesao"

// Card de listagem (catálogo de artesãos). O perfil completo é a página /artesaos/[id].
export function ArtisanCard({ artesao }: { artesao: Artesao }) {
  const { id, nome, cidade, estado, bio, fotoUrl, tecnicas } = artesao

  return (
    <Box borderWidth="1px" borderColor="origem.laranja" borderRadius="2xl" overflow="hidden">
      <Image src={fotoUrl} alt={nome} w="full" h="220px" objectFit="cover" />

      <Stack gap="2" p="4">
        <Heading as="h3" variant="titulo" size="xl">
          {nome}
        </Heading>
        <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" color="origem.textoSuave">
          {cidade}, {estado}
        </Text>

        <HStack gap="2" wrap="wrap">
          {tecnicas.slice(0, 2).map((tecnica) => (
            <Badge key={tecnica}>{tecnica}</Badge>
          ))}
        </HStack>

        <Text fontSize="sm" color="origem.texto" lineClamp={3}>
          {bio}
        </Text>

        <Button asChild variant="origem" mt="2">
          <NextLink href={`/artesaos/${id}`}>Conheça o artesão →</NextLink>
        </Button>
      </Stack>
    </Box>
  )
}
