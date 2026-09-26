import { Badge, Box, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react"
import { Price } from "@/components/common/Price"
import type { Produto } from "@/types/produto"

// Card de peça da vitrine e do catálogo. Recebe o Produto inteiro, mas usa só os campos do card.
export function ProductCard({ produto }: { produto: Produto }) {
  const { titulo, tags, artesaoNome, cidade, medidas, preco, imagemUrl } = produto

  return (
    <Box
      borderWidth="1px"
      borderColor="origem.laranja"
      borderRadius="2xl"
      overflow="hidden"
    >
      <Image src={imagemUrl} alt={titulo} w="full" h="260px" objectFit="cover" />

      <Stack gap="1" p="4">
        <HStack gap="2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </HStack>

        <Heading as="h3" size="2xl">
          {titulo}
        </Heading>

        <Text fontWeight="bold" textTransform="uppercase" fontSize="sm">
          {artesaoNome}, {cidade}
        </Text>
        <Text fontSize="xs">
          {medidas}
        </Text>

        <Price valor={preco} textAlign="right" fontSize="lg" mt="2" />
      </Stack>
    </Box>
  )
}
