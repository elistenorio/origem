"use client"

import { useState } from "react"
import { Badge, Box, Button, Grid, Heading, HStack, Link, Separator, Text, VStack } from "@chakra-ui/react"
import NextLink from "next/link"
import { useRouter } from "next/navigation"
import { FreightCalculator } from "@/components/common/FreightCalculator"
import { QuantityStepper } from "@/components/common/QuantityStepper"
import { useCartStore } from "@/store/cartStore"
import type { Produto } from "@/types/produto"
import { formatCurrency } from "@/utils/formatCurrency"

type ProductPurchasePanelProps = {
  produto: Produto
}

// Painel de compra da página de detalhe: título, preço, disponibilidade, quantidade, frete e os botões do carrinho.
// A quantidade escolhida e o aviso de "adicionado" são estado só deste painel.
export function ProductPurchasePanel({ produto }: ProductPurchasePanelProps) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)

  const esgotado = produto.estoque <= 0

  function adicionarAoCarrinho() {
    addItem(produto, quantidade)
    setAdicionado(true)
  }

  function comprarAgora() {
    addItem(produto, quantidade)
    router.push("/carrinho")
  }

  return (
    <VStack flex="1" align="stretch" gap={6} maxW={{ lg: "450px" }}>

      <Box>
        <HStack gap={2} mb={3} wrap="wrap">
          {produto.tags.map((tag) => (
            <Badge key={tag} variant="origem">{tag.toUpperCase()}</Badge>
          ))}
        </HStack>
        <Heading variant="titulo" fontSize="5xl" lineHeight="1" mb={2}>{produto.titulo}</Heading>
        <Text color="origem.texto" fontWeight="bold" textTransform="uppercase" fontSize="sm">
          {produto.artesaoNome}, {produto.cidade}
        </Text>
      </Box>

      <Text color="origem.texto" fontSize="4xl" mt={2}>
        {formatCurrency(produto.preco)}
      </Text>

      <Separator borderColor="origem.passoFundo" />

      <Box>
        <Text color="origem.texto" fontWeight="bold" fontSize="sm" mb={1}>Disponibilidade</Text>
        <Text color="origem.textoSuave" fontSize="sm">
          {esgotado ? "Esgotado" : `Estoque: ${produto.estoque} ${produto.estoque === 1 ? "unidade" : "unidades"}`}
        </Text>
      </Box>

      {!esgotado && (
        <Box>
          <Text color="origem.texto" fontWeight="bold" fontSize="sm" mb={1}>Quantidade</Text>
          <QuantityStepper value={quantidade} onChange={setQuantidade} max={produto.estoque} />
        </Box>
      )}

      <FreightCalculator />

      <Box bg="origem.passoFundo" p={4} borderRadius="md">
        <Text fontWeight="bold" fontSize="sm" mb={2}>Formas de pagamento</Text>
        <Grid templateColumns="1fr 1fr" gap={4}>
          <Text fontSize="xs">Cartão de crédito<br/><strong>Até 12x sem juros</strong></Text>
          <Text fontSize="xs">Pix<br/><strong>5% de desconto</strong></Text>
        </Grid>
      </Box>

      <HStack gap={4} mt={2}>
        <Button variant="origem" flex="1" onClick={comprarAgora} disabled={esgotado}>Comprar agora</Button>
        <Button variant="origem" flex="1" onClick={adicionarAoCarrinho} disabled={esgotado}>Adicionar ao carrinho</Button>
      </HStack>

      {adicionado && (
        <Text fontSize="sm" color="origem.texto" role="status">
          Peça adicionada ao carrinho.{" "}
          <Link asChild color="origem.laranja" textDecoration="underline">
            <NextLink href="/carrinho">Ver carrinho</NextLink>
          </Link>
        </Text>
      )}

    </VStack>
  )
}
