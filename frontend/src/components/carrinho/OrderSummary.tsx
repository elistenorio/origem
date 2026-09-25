import { Flex, Separator, Stack, Text } from "@chakra-ui/react"
import { SectionCard } from "@/components/common/SectionCard"
import { Price } from "@/components/common/Price"
import { formatCurrency } from "@/utils/formatCurrency"
import type { OpcaoFrete } from "@/dados-exemplo/tipos"

type OrderSummaryProps = {
  quantidade: number
  subtotal: number
  frete: OpcaoFrete | null
  children?: React.ReactNode   // botão de ação (continuar / finalizar)
}

const PARCELAS_SEM_JUROS = 6

// "Resumo do pedido": subtotal, frete e total (carrinho e checkout).
export function OrderSummary({ quantidade, subtotal, frete, children }: OrderSummaryProps) {
  const total = subtotal + (frete?.valor ?? 0)
  return (
    <SectionCard title="Resumo do pedido">
      <Stack gap="3">
        <Flex justify="space-between">
          <Text>Subtotal ({quantidade} {quantidade === 1 ? "item" : "itens"})</Text>
          <Text fontWeight="bold">{formatCurrency(subtotal)}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text>Frete {frete ? `(${frete.nome})` : ""}</Text>
          <Text fontWeight="bold">{frete ? formatCurrency(frete.valor) : "Calcule pelo CEP"}</Text>
        </Flex>
        <Separator borderColor="origem.marrom/50" />
        <Flex justify="space-between" align="center">
          <Text textStyle="rotulo" fontSize="md">Total</Text>
          <Price valor={total} fontSize="3xl" color="origem.laranja" />
        </Flex>
        <Text textStyle="apoio">ou {PARCELAS_SEM_JUROS}x de {formatCurrency(total / PARCELAS_SEM_JUROS)} sem juros</Text>
        {children}
      </Stack>
    </SectionCard>
  )
}
