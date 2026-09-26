"use client"

import { useState } from "react"
import { Button, Flex, Stack, Text } from "@chakra-ui/react"
import { OrigemDialog } from "@/components/common/OrigemDialog"
import { StarRating } from "@/components/common/StarRating"
import { Tile } from "@/components/common/Tile"
import { TextareaField } from "@/components/common/TextareaField"
import { FileField } from "@/components/common/FileField"
import { ApiError } from "@/services/api"
import { avaliacoesService } from "@/services/avaliacoes.service"
import type { NotasAvaliacao } from "@/types/avaliacao"
import type { Pedido } from "@/types/pedido"
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
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string>()

  function fechar() {
    setNota(0); setComentario(""); setNotas({}); setFotos([]); setEnviado(false); setErro(undefined)
    onClose()
  }

  // POST /avaliacoes. As fotos não são enviadas na Avaliação 1 (upload real entra na Avaliação 2).
  async function handleEnviar() {
    if (!pedido) return
    setEnviando(true)
    setErro(undefined)
    try {
      await avaliacoesService.criar({ pedidoId: pedido.id, nota, comentario, notas })
      setEnviado(true)
      onAvaliado(pedido.id)
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível enviar a avaliação.")
    } finally {
      setEnviando(false)
    }
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
      rodape={<Button variant="origem" w="full" onClick={handleEnviar} disabled={nota === 0} loading={enviando}>Enviar avaliação</Button>}
    >
      {pedido && (
        <Stack gap="5">
          <OrderMiniSummary pedido={pedido} />
          <Stack align="center" gap="2">
            <Text textStyle="rotulo">Como foi sua experiência?</Text>
            <StarRating value={nota} onChange={setNota} size="lg" />
          </Stack>
          <TextareaField label="Conte sobre sua experiência" placeholder="O que você achou da peça, do atendimento e da entrega?" value={comentario} onChange={(e) => setComentario(e.target.value)} />
          <Tile display="flex" flexDirection="column" gap="2" p="4">
            <Text textStyle="rotulo">Avalie também (opcional)</Text>
            {CRITERIOS.map(({ chave, rotulo }) => (
              <Flex key={chave} justify="space-between" align="center">
                <Text>{rotulo}</Text>
                <StarRating value={notas[chave] ?? 0} onChange={(v) => setNotas((n) => ({ ...n, [chave]: v }))} size="sm" />
              </Flex>
            ))}
          </Tile>
          <Stack gap="2">
            <Text textStyle="rotulo">Adicione fotos (opcional)</Text>
            <FileField label="Fotos da avaliação" value={fotos} onChange={setFotos} multiple />
          </Stack>
          {erro && <Text color="origem.perigo" fontSize="sm" role="alert">{erro}</Text>}
        </Stack>
      )}
    </OrigemDialog>
  )
}
