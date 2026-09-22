import { Badge, Box, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react"
import type { Product } from "@/types/product"

export function ProductCard({ product }: { product: Product }) {
  const { title, tags, artisan, city, dimensions, price, imageUrl } = product

  // "1.250,90" -> ["1.250", "90"], para deixar os centavos menores como no design
  const [inteiro, centavos] = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
  })
    .format(price)
    .split(",")

  return (
    <Box
      borderWidth="1px"
      borderColor="origem.laranja"
      borderRadius="2xl"
      overflow="hidden"
    >
      <Image src={imageUrl} alt={title} w="full" h="260px" objectFit="cover" />

      <Stack gap="1" p="4">
        <HStack gap="2">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </HStack>

        <Heading as="h3" size="2xl">
          {title}
        </Heading>

        <Text fontWeight="bold" textTransform="uppercase" fontSize="sm">
          {artisan}, {city}
        </Text>
        <Text fontSize="xs">
          {dimensions}
        </Text>

        <Text textAlign="right" fontSize="lg" mt="2">
          R$ {inteiro},
          <Text as="span" fontSize="sm">{centavos}</Text>
        </Text>
      </Stack>
    </Box>
  )
}