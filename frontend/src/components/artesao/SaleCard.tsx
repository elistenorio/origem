import { HStack, Separator, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { AvatarItem } from "@/components/common/AvatarItem"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Tile } from "@/components/common/Tile"
import { formatCurrency } from "@/utils/formatCurrency"
import { formatDate } from "@/utils/formatDate"
import type { VendaArtesao } from "@/types/pedido"

export function SaleCard({ venda }: { venda: VendaArtesao }) {
  return (
    <Tile display="flex" flexDirection="column" gap="4">
      <HStack justify="space-between" align="flex-start" gap="3" wrap="wrap">
        <Stack gap="0">
          <Text fontWeight="bold">Pedido {venda.codigo}</Text>
          <Text textStyle="apoio">{formatDate(venda.criadoEm)} · Entrega em {venda.cidade}</Text>
        </Stack>
        <StatusBadge status={venda.status} />
      </HStack>
      <Stack gap="3">
        {venda.itens.map((item) => (
          <HStack key={item.produtoId} justify="space-between" gap="3">
            <AvatarItem src={item.imagemUrl} titulo={item.titulo} subtitulo={`${item.quantidade} × ${formatCurrency(item.precoUnitario)}`} />
            <Text fontWeight="bold" flexShrink={0}>{formatCurrency(item.precoUnitario * item.quantidade)}</Text>
          </HStack>
        ))}
      </Stack>
      <Separator />
      <SimpleGrid columns={{ base: 1, sm: 3 }} gap="3">
        <Stack gap="0">
          <Text textStyle="rotulo">Total das suas peças</Text>
          <Text fontWeight="bold">{formatCurrency(venda.subtotal)}</Text>
        </Stack>
        <Stack gap="0">
          <Text textStyle="rotulo">Rastreio</Text>
          <Text>{venda.codigoRastreio ?? "Disponível após o envio"}</Text>
        </Stack>
        {venda.previsaoEntrega && (
          <Stack gap="0">
            <Text textStyle="rotulo">Previsão de entrega</Text>
            <Text>{formatDate(venda.previsaoEntrega)}</Text>
          </Stack>
        )}
      </SimpleGrid>
    </Tile>
  )
}
