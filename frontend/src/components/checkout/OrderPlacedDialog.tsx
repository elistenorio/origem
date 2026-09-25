import NextLink from "next/link"
import { Button, Stack, Text } from "@chakra-ui/react"
import { OrigemDialog } from "@/components/common/OrigemDialog"
import { formatCurrency } from "@/utils/formatCurrency"
export type PedidoRealizado = { nome: string; codigo: string; total: number }

type OrderPlacedDialogProps = { pedido: PedidoRealizado | null; onClose: () => void }

// Pop-up "Compra realizada" (Tela 07.5).
export function OrderPlacedDialog({ pedido, onClose }: OrderPlacedDialogProps) {
  return (
    <OrigemDialog open={!!pedido} onClose={onClose} titulo="Obrigada por apoiar nossos artistas!">
      {pedido && (
        <Stack gap="4" pb="4">
          <Text fontSize="lg">
            Olá, {pedido.nome.split(" ")[0]}! Seu pedido <strong>{pedido.codigo}</strong> no valor de <strong>{formatCurrency(pedido.total)}</strong> foi recebido com sucesso.
          </Text>
          <Text textStyle="apoio">Você receberá as informações de acompanhamento e entrega no seu e-mail.</Text>
          <Button asChild variant="origem">
            <NextLink href="/pedidos">Acompanhar o pedido</NextLink>
          </Button>
          <Button asChild variant="claro">
            <NextLink href="/catalogo">Voltar ao catálogo</NextLink>
          </Button>
        </Stack>
      )}
    </OrigemDialog>
  )
}
