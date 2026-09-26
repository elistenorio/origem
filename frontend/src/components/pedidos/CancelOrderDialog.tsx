"use client"

import { useState } from "react"
import { Alert, Button, RadioGroup, Stack, Text } from "@chakra-ui/react"
import { OrigemDialog } from "@/components/common/OrigemDialog"
import { TextareaField } from "@/components/common/TextareaField"
import { MOTIVOS_CANCELAMENTO } from "@/constants/pedidos"
import { ApiError } from "@/services/api"
import { pedidosService } from "@/services/pedidos.service"
import { formatCurrency } from "@/utils/formatCurrency"
import type { Pedido } from "@/types/pedido"
import { OrderMiniSummary } from "./OrderMiniSummary"

type CancelOrderDialogProps = {
  pedido: Pedido | null
  onClose: () => void
  onCancelado: (id: string, motivo: string) => void
}

// Pop-up de cancelamento do pedido (Tela 08.1). Motivo obrigatório.
export function CancelOrderDialog({ pedido, onClose, onCancelado }: CancelOrderDialogProps) {
  const [motivo, setMotivo] = useState("")
  const [observacao, setObservacao] = useState("")
  const [tentouEnviar, setTentouEnviar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string>()

  function fechar() {
    setMotivo("")
    setObservacao("")
    setTentouEnviar(false)
    setErro(undefined)
    onClose()
  }

  // PATCH /pedidos/{id} com status "cancelado".
  async function handleConfirmar() {
    setTentouEnviar(true)
    if (!pedido || !motivo) return
    const rotulo = MOTIVOS_CANCELAMENTO.find((m) => m.value === motivo)?.label ?? motivo
    setEnviando(true)
    setErro(undefined)
    try {
      await pedidosService.cancelar(pedido.id, { status: "cancelado", motivo: rotulo, observacao: observacao || undefined })
      onCancelado(pedido.id, rotulo)
      fechar()
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível cancelar o pedido.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <OrigemDialog
      open={!!pedido}
      onClose={fechar}
      titulo="Cancelar pedido?"
      descricao="Conte o motivo para que possamos melhorar."
      rodape={
        <>
          <Button variant="claro" onClick={fechar}>Voltar</Button>
          <Button variant="perigo" onClick={handleConfirmar} loading={enviando}>Confirmar cancelamento</Button>
        </>
      }
    >
      {pedido && (
        <Stack gap="5">
          <OrderMiniSummary pedido={pedido} />
          <RadioGroup.Root value={motivo} onValueChange={(e) => setMotivo(e.value ?? "")} aria-label="Motivo do cancelamento">
            <RadioGroup.Label>Motivo do cancelamento *</RadioGroup.Label>
            <Stack gap="2" mt="3">
              {MOTIVOS_CANCELAMENTO.map((m) => (
                <RadioGroup.Item key={m.value} value={m.value}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText>{m.label}</RadioGroup.ItemText>
                </RadioGroup.Item>
              ))}
            </Stack>
          </RadioGroup.Root>
          {tentouEnviar && !motivo && <Text color="origem.perigo" fontSize="sm">Escolha um motivo para continuar.</Text>}
          <TextareaField label="Observação (opcional)" placeholder="Conte mais detalhes, se quiser." value={observacao} onChange={(e) => setObservacao(e.target.value)} />
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Description>
              O reembolso de {formatCurrency(pedido.total)} será feito na mesma forma de pagamento em até 10 dias úteis.
            </Alert.Description>
          </Alert.Root>
          {erro && <Text color="origem.perigo" fontSize="sm" role="alert">{erro}</Text>}
        </Stack>
      )}
    </OrigemDialog>
  )
}
