import { Badge, Box, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react"
import { Price } from "@/components/common/Price"
import type { Product } from "@/types/product"

export function ProductCard({ product }: { product: Product }) {
  const { title, tags, artisan, city, dimensions, price, imageUrl } = product

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

        <Price valor={price} textAlign="right" fontSize="lg" mt="2" />
      </Stack>
    </Box>
  )
}