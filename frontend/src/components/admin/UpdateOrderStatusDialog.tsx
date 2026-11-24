"use client"

import { useState } from "react"
import { Button, Stack, Text } from "@chakra-ui/react"
import { FormField } from "@/components/common/FormField"
import { OrigemDialog } from "@/components/common/OrigemDialog"
import { OrderMiniSummary } from "@/components/pedidos/OrderMiniSummary"
import { PROXIMO_PASSO } from "@/constants/pedidos"
import { ApiError } from "@/services/api"
import { pedidosService } from "@/services/pedidos.service"
import type { Pedido } from "@/types/pedido"

type UpdateOrderStatusDialogProps = {
  pedido: Pedido | null
  onClose: () => void
  onAtualizado: () => void
}

export function UpdateOrderStatusDialog({ pedido, onClose, onAtualizado }: UpdateOrderStatusDialogProps) {
  const [codigoRastreio, setCodigoRastreio] = useState("")
  const [tentouEnviar, setTentouEnviar] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string>()

  const passo = pedido ? PROXIMO_PASSO[pedido.status] : undefined
  const pedeRastreio = passo?.status === "enviado"
  const faltaRastreio = pedeRastreio && !codigoRastreio.trim()

  function limpar() {
    setCodigoRastreio("")
    setTentouEnviar(false)
    setErro(undefined)
  }

  function fechar() {
    limpar()
    onClose()
  }

  async function handleConfirmar() {
    setTentouEnviar(true)
    if (!pedido || !passo || faltaRastreio) return
    setEnviando(true)
    setErro(undefined)
    try {
      await pedidosService.avancar(pedido.id, {
        status: passo.status,
        codigoRastreio: pedeRastreio ? codigoRastreio.trim() : undefined,
      })
      limpar()
      onAtualizado()
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível atualizar o pedido.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <OrigemDialog
      open={!!pedido}
      onClose={fechar}
      titulo={passo ? `${passo.acao}?` : undefined}
      descricao={pedido ? `Pedido ${pedido.codigo} de ${pedido.comprador.nome}` : undefined}
      rodape={
        <>
          <Button variant="claro" onClick={fechar}>Voltar</Button>
          <Button variant="origem" onClick={handleConfirmar} loading={enviando}>Confirmar</Button>
        </>
      }
    >
      {pedido && (
        <Stack gap="5">
          <OrderMiniSummary pedido={pedido} />
          {pedeRastreio && (
            <FormField
              label="Código de rastreio *"
              placeholder="Ex.: BR123456789BR"
              value={codigoRastreio}
              onChange={(e) => setCodigoRastreio(e.target.value)}
              error={tentouEnviar && faltaRastreio ? "Informe o código de rastreio." : undefined}
            />
          )}
          {erro && <Text color="origem.perigo" fontSize="sm" role="alert">{erro}</Text>}
        </Stack>
      )}
    </OrigemDialog>
  )
}
