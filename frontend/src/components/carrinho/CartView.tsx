"use client"

import { useSyncExternalStore } from "react"
import NextLink from "next/link"
import { Box, Button, Flex, Link, Stack, Text } from "@chakra-ui/react"
import { BiRightArrowAlt } from "react-icons/bi"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/common/SectionCard"
import { EmptyMessage } from "@/components/feedback/EmptyMessage"
import { LoadingState } from "@/components/feedback/LoadingState"
import { useCartStore } from "@/store/cartStore"
import { CartItemRow } from "./CartItemRow"
import { ShippingCalculator } from "./ShippingCalculator"
import { OrderSummary } from "./OrderSummary"

// Carrinho (Tela 06): itens + frete + resumo, lidos do cartStore (Zustand, salvo no navegador).
export function CartView() {
  const itens = useCartStore((state) => state.items)
  const frete = useCartStore((state) => state.frete)
  const setFrete = useCartStore((state) => state.setFrete)
  const alterarQuantidade = useCartStore((state) => state.updateQuantity)
  const remover = useCartStore((state) => state.removeItem)
  const quantidade = useCartStore((state) => state.totalItems())
  const subtotal = useCartStore((state) => state.totalPrice())

  // O carrinho fica salvo no navegador; o servidor não o conhece. Até a tela abrir no navegador,
  // mostra "carregando" (servidor e navegador desenham o mesmo e não há erro de hidratação).
  const noNavegador = useSyncExternalStore(() => () => {}, () => true, () => false)
  if (!noNavegador) return <PageContainer><LoadingState /></PageContainer>

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
