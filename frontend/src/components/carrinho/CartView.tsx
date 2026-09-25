"use client"

import { useState } from "react"
import NextLink from "next/link"
import { Box, Button, Flex, Link, Stack, Text } from "@chakra-ui/react"
import { BiRightArrowAlt } from "react-icons/bi"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/common/SectionCard"
import { EmptyMessage } from "@/components/feedback/EmptyMessage"
import { carrinhoExemplo } from "@/dados-exemplo/pedidos"
import type { ItemCarrinho, OpcaoFrete } from "@/dados-exemplo/tipos"
import { CartItemRow } from "./CartItemRow"
import { ShippingCalculator } from "./ShippingCalculator"
import { OrderSummary } from "./OrderSummary"

// Carrinho (Tela 06): itens + frete + resumo. Por enquanto com itens de exemplo em estado local.
export function CartView() {
  const [itens, setItens] = useState<ItemCarrinho[]>(carrinhoExemplo)
  const [frete, setFrete] = useState<OpcaoFrete | null>(null)
  const quantidade = itens.reduce((soma, i) => soma + i.quantidade, 0)
  const subtotal = itens.reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0)

  const alterarQuantidade = (id: string, q: number) =>
    setItens((atual) => atual.map((i) => (i.produto.id === id ? { ...i, quantidade: Math.min(Math.max(q, 1), Math.max(i.produto.estoque, 1)) } : i)))
  const remover = (id: string) => setItens((atual) => atual.filter((i) => i.produto.id !== id))

  return (
    <PageContainer>
      <PageHeader trilha={[{ label: "Home", href: "/" }, { label: "Carrinho" }]} titulo="Seu carrinho" subtitulo={quantidade > 0 ? `${quantidade} ${quantidade === 1 ? "peça" : "peças"}` : undefined} />
      {itens.length === 0 ? (
        <EmptyMessage titulo="Seu carrinho está vazio" descricao="Que tal conhecer as peças feitas à mão pelos nossos artesãos?">
          <Button asChild variant="origem">
            <NextLink href="/catalogo">Ir para o catálogo</NextLink>
          </Button>
        </EmptyMessage>
      ) : (
        <Flex gap="10" direction={{ base: "column", lg: "row" }} align="flex-start">
          <Stack flex="1" w="full">
            {itens.map((item) => (
              <CartItemRow key={item.produto.id} item={item} onAlterarQuantidade={(q) => alterarQuantidade(item.produto.id, q)} onRemover={() => remover(item.produto.id)} />
            ))}
            <Link asChild variant="origem" mt="4">
              <NextLink href="/catalogo">← Continuar comprando</NextLink>
            </Link>
          </Stack>
          <Stack w={{ base: "full", lg: "400px" }} gap="4" flexShrink={0}>
            <SectionCard title="Frete">
              <ShippingCalculator frete={frete} onEscolher={setFrete} />
            </SectionCard>
            <OrderSummary quantidade={quantidade} subtotal={subtotal} frete={frete}>
              {frete ? (
                <Button asChild variant="origem" w="full">
                  <NextLink href="/checkout">
                    Continuar para pagamento <BiRightArrowAlt />
                  </NextLink>
                </Button>
              ) : (
                <Box>
                  <Button variant="origem" w="full" disabled>
                    Continuar para pagamento <BiRightArrowAlt />
                  </Button>
                  <Text textStyle="apoio" mt="2">Calcule o frete para continuar.</Text>
                </Box>
              )}
            </OrderSummary>
          </Stack>
        </Flex>
      )}
    </PageContainer>
  )
}
