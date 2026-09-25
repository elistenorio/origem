import { Badge, Card, Heading, HStack, Image, Text } from "@chakra-ui/react"
import { Price } from "@/components/common/Price"
import type { Produto } from "@/types/produto"

type ProductCardProps = {
  produto: Pick<Produto, "titulo" | "tags" | "artesaoNome" | "cidade" | "medidas" | "preco" | "imagemUrl">
}

export function ProductCard({ produto }: ProductCardProps) {
  const { titulo, tags, artesaoNome, cidade, medidas, preco, imagemUrl } = produto

  return (
    <Card.Root variant="vitrine" h="full">
      <Image src={imagemUrl} alt={titulo} w="full" h="260px" objectFit="cover" />

      <Card.Body>
        <HStack gap="2" wrap="wrap">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </HStack>

        <Heading as="h3" size="2xl">
          {titulo}
        </Heading>

        <Text textStyle="rotulo">
          {artesaoNome}, {cidade}
        </Text>
        <Text textStyle="apoio">{medidas}</Text>

        <Price valor={preco} textAlign="right" fontSize="lg" mt="2" />
      </Card.Body>
    </Card.Root>
  )
}
