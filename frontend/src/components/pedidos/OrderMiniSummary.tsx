import { HStack, Image, Stack, Text } from "@chakra-ui/react"
import { StatusBadge } from "@/components/common/StatusBadge"
import { formatCurrency } from "@/utils/formatCurrency"
import type { Pedido } from "@/dados-exemplo/tipos"

// Resumo curto do pedido usado dentro dos pop-ups (cancelar, avaliar).
export function OrderMiniSummary({ pedido }: { pedido: Pedido }) {
  const [item] = pedido.itens
  return (
    <HStack gap="4" bg="origem.passoFundo" borderRadius="lg" p="4" align="center">
      <Image src={item.imagemUrl} alt={item.titulo} boxSize="72px" borderRadius="md" objectFit="cover" />
      <Stack gap="0" flex="1">
        <Text fontWeight="bold">{item.titulo}</Text>
        <Text textStyle="apoio">Pedido {pedido.codigo} · {formatCurrency(pedido.total)}</Text>
      </Stack>
      <StatusBadge status={pedido.status} />
    </HStack>
  )
}
