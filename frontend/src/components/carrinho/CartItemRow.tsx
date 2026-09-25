import NextLink from "next/link"
import { Badge, Flex, Heading, HStack, IconButton, Image, Link, Stack, Text } from "@chakra-ui/react"
import { BiTrash } from "react-icons/bi"
import { Price } from "@/components/common/Price"
import { QuantityStepper } from "@/components/common/QuantityStepper"
import type { ItemCarrinho } from "@/types/carrinho"

type CartItemRowProps = {
  item: ItemCarrinho
  onAlterarQuantidade: (quantidade: number) => void
  onRemover: () => void
}

// Uma linha do carrinho: foto, nome, artesão, quantidade, preço e remover.
export function CartItemRow({ item, onAlterarQuantidade, onRemover }: CartItemRowProps) {
  const { produto, quantidade } = item
  return (
    <Flex gap="4" py="5" borderBottomWidth="1px" borderColor="origem.laranja/30" align="flex-start">
      <Image src={produto.imagemUrl} alt={produto.titulo} boxSize={{ base: "88px", md: "130px" }} borderRadius="lg" objectFit="cover" flexShrink={0} />
      <Stack flex="1" gap="2" minW="0">
        <HStack gap="2" wrap="wrap">
          {produto.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </HStack>
        <Heading as="h3" size="2xl">
          <Link asChild _hover={{ textDecoration: "none", opacity: 0.8 }}>
            <NextLink href={`/produtos/${produto.id}`}>{produto.titulo}</NextLink>
          </Link>
        </Heading>
        <Text textStyle="rotulo">{produto.artesaoNome}, {produto.cidade}</Text>
        <QuantityStepper value={quantidade} onChange={onAlterarQuantidade} max={produto.estoque} />
      </Stack>
      <Stack align="flex-end" justify="space-between" alignSelf="stretch">
        <IconButton aria-label={`Remover ${produto.titulo}`} variant="claro" minH="auto" size="sm" onClick={onRemover}>
          <BiTrash />
        </IconButton>
        <Price valor={produto.preco * quantidade} fontSize={{ base: "xl", md: "3xl" }} />
      </Stack>
    </Flex>
  )
}
