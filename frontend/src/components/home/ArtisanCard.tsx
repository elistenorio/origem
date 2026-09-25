import NextLink from "next/link"
import { Badge, Box, Button, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react"
import type { Artisan } from "@/types/artisan"

// Card de listagem (catálogo de artesãos). O perfil completo é a página /artesaos/[id].
export function ArtisanCard({ artisan }: { artisan: Artisan }) {
  const { id, name, city, region, bio, avatarUrl, techniques } = artisan

  return (
    <Box borderWidth="1px" borderColor="origem.laranja" borderRadius="2xl" overflow="hidden">
      <Image src={avatarUrl} alt={name} w="full" h="220px" objectFit="cover" />

      <Stack gap="2" p="4">
        <Heading as="h3" variant="titulo" size="xl">
          {name}
        </Heading>
        <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" color="origem.textoSuave">
          {city}, {region}
        </Text>

        <HStack gap="2" wrap="wrap">
          {techniques.slice(0, 2).map((technique) => (
            <Badge key={technique}>{technique}</Badge>
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
