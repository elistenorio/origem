"use client"

import { useState } from "react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { Badge, Button, Heading, HStack, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { BiCart, BiCheckCircle, BiMapPin, BiRightArrowAlt } from "react-icons/bi"
import { Price } from "@/components/common/Price"
import { QuantityStepper } from "@/components/common/QuantityStepper"
import { StatusBadge, type StatusKey } from "@/components/common/StatusBadge"
import { Tile } from "@/components/common/Tile"
import { ShippingCalculator } from "@/components/carrinho/ShippingCalculator"
import { LIMITE_BAIXO_ESTOQUE } from "@/constants/pedidos"
import { useCartStore } from "@/store/cartStore"
import type { Produto } from "@/types/produto"

const FORMAS_PAGAMENTO = [
  { titulo: "Cartão de crédito", detalhe: "Até 6x sem juros" },
  { titulo: "Pix", detalhe: "Aprovação na hora" },
  { titulo: "Boleto", detalhe: "Compras acima de R$ 50" },
]

function disponibilidade(produto: Produto): StatusKey {
  if (produto.estoque === 0) return "esgotado"
  if (!produto.pecaUnica && produto.estoque <= LIMITE_BAIXO_ESTOQUE) return "ultimasUnidades"
  return "disponivel"
}

// Coluna de compra da página da peça: nome, artesão, preço, estoque, quantidade, frete e botões.
export function ProductPurchasePanel({ produto }: { produto: Produto }) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const [quantidade, setQuantidade] = useState(1)
  const [adicionada, setAdicionada] = useState(false)
  const esgotado = produto.estoque === 0

  function adicionar() {
    addItem(produto, quantidade)
    setAdicionada(true)
  }

  function comprarAgora() {
    addItem(produto, quantidade)
    router.push("/checkout")
  }

  return (
    <Stack gap="6" flex="1" minW="0" maxW={{ lg: "614px" }}>
      <Stack gap="3">
        <HStack gap="2" wrap="wrap">
          {produto.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </HStack>
        <Heading as="h1" variant="titulo" fontSize={{ base: "4xl", md: "6xl" }} lineHeight="1">
          {produto.titulo}
        </Heading>
        <HStack gap="1">
          <BiMapPin aria-hidden />
          <Link asChild variant="origem">
            <NextLink href={`/artesaos/${produto.artesaoId}`}>
              {produto.artesaoNome}, {produto.cidade}
            </NextLink>
          </Link>
        </HStack>
      </Stack>

      <Price valor={produto.preco} fontSize="4xl" />

      <HStack gap="3" wrap="wrap">
        <Text textStyle="rotulo">Disponibilidade</Text>
        <StatusBadge status={disponibilidade(produto)} />
        <Text textStyle="apoio">{produto.pecaUnica ? "Peça única" : `${produto.estoque} em estoque`}</Text>
      </HStack>

      {!esgotado && (
        <Stack gap="2">
          <Text textStyle="rotulo">Quantidade</Text>
          <QuantityStepper value={quantidade} onChange={setQuantidade} max={produto.estoque} />
        </Stack>
      )}

      <ShippingCalculator />

      <Tile p="5">
        <Stack gap="3">
          <Text textStyle="rotulo">Formas de pagamento</Text>
          <SimpleGrid columns={{ base: 1, sm: 3 }} gap="3">
            {FORMAS_PAGAMENTO.map((forma) => (
              <Stack key={forma.titulo} gap="0">
                <Text fontWeight="bold">{forma.titulo}</Text>
                <Text textStyle="apoio">{forma.detalhe}</Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Stack>
      </Tile>

      {esgotado ? (
        <Button variant="claro" disabled>
          Peça esgotada
        </Button>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap="3">
          <Button variant="claro" onClick={adicionar}>
            <BiCart /> Adicionar ao carrinho
          </Button>
          <Button variant="origem" onClick={comprarAgora}>
            Comprar agora <BiRightArrowAlt />
          </Button>
        </SimpleGrid>
      )}

      {adicionada && (
        <HStack gap="2" role="status">
          <BiCheckCircle aria-hidden />
          <Text>Peça adicionada ao carrinho.</Text>
          <Link asChild variant="origem">
            <NextLink href="/carrinho">Ver carrinho</NextLink>
          </Link>
        </HStack>
      )}
    </Stack>
  )
}
