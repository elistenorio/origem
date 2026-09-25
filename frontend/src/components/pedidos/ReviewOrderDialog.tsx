"use client"

import { useState } from "react"
import { Button, Flex, Stack, Text } from "@chakra-ui/react"
import { OrigemDialog } from "@/components/common/OrigemDialog"
import { StarRating } from "@/components/common/StarRating"
import { TextareaField } from "@/components/common/TextareaField"
import { FileField } from "@/components/common/FileField"
import type { NotasAvaliacao } from "@/dados-exemplo/tipos"
import type { Pedido } from "@/dados-exemplo/tipos"
import { OrderMiniSummary } from "./OrderMiniSummary"

type ReviewOrderDialogProps = {
  pedido: Pedido | null
  onClose: () => void
  onAvaliado: (id: string) => void
}

const CRITERIOS: { chave: keyof NotasAvaliacao; rotulo: string }[] = [
  { chave: "produto", rotulo: "Produto" },
  { chave: "embalagem", rotulo: "Embalagem" },
  { chave: "entrega", rotulo: "Entrega" },
]

// Avaliar o pedido (Tela 09) e confirmação após o envio (Tela 09.1).
export function ReviewOrderDialog({ pedido, onClose, onAvaliado }: ReviewOrderDialogProps) {
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState("")
  const [notas, setNotas] = useState<NotasAvaliacao>({})
  const [fotos, setFotos] = useState<File[]>([])
  const [enviado, setEnviado] = useState(false)

  function fechar() {
    setNota(0); setComentario(""); setNotas({}); setFotos([]); setEnviado(false)
    onClose()
  }

  function handleEnviar() {
    if (!pedido) return
    setEnviado(true)
    onAvaliado(pedido.id)
  }

  if (enviado) {
    return (
      <OrigemDialog open={!!pedido} onClose={fechar} titulo="Obrigada pela avaliação!" size="sm">
        <Stack gap="4" pb="4" align="center" textAlign="center">
          <StarRating value={nota} />
          <Text>Sua avaliação foi enviada e vai aparecer na página da peça depois de uma rápida revisão.</Text>
          <Button variant="origem" w="full" onClick={fechar}>Voltar para Meus pedidos</Button>
        </Stack>
      </OrigemDialog>
    )
  }

  return (
    <OrigemDialog
      open={!!pedido}
      onClose={fechar}
      titulo="Avaliar o pedido"
      descricao="Sua avaliação ajuda outros compradores e valoriza o trabalho do artesão."
      size="lg"
      rodape={<Button variant="origem" w="full" onClick={handleEnviar} disabled={nota === 0}>Enviar avaliação</Button>}
    >
      {pedido && (
        <Stack gap="5">
          <OrderMiniSummary pedido={pedido} />
          <Stack align="center" gap="2">
            <Text textStyle="rotulo">Como foi sua experiência?</Text>
            <StarRating value={nota} onChange={setNota} size="lg" />
          </Stack>
          <TextareaField label="Conte sobre sua experiência" placeholder="O que você achou da peça, do atendimento e da entrega?" value={comentario} onChange={(e) => setComentario(e.target.value)} />
          <Stack gap="2" bg="origem.passoFundo" borderRadius="lg" p="4">
            <Text textStyle="rotulo">Avalie também (opcional)</Text>
            {CRITERIOS.map(({ chave, rotulo }) => (
              <Flex key={chave} justify="space-between" align="center">
                <Text>{rotulo}</Text>
                <StarRating value={notas[chave] ?? 0} onChange={(v) => setNotas((n) => ({ ...n, [chave]: v }))} size="sm" />
              </Flex>
            ))}
          </Stack>
          <Stack gap="2">
            <Text textStyle="rotulo">Adicione fotos (opcional)</Text>
            <FileField label="Fotos da avaliação" value={fotos} onChange={setFotos} multiple />
          </Stack>
        </Stack>
      )}
    </OrigemDialog>
  )
}
