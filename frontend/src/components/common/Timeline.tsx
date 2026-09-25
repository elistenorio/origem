import { Box, Text } from "@chakra-ui/react"
import { formatDateTime } from "@/utils/formatDate"

type EventoTimeline = { titulo: string; data: string }

// Eventos com a linha laranja à esquerda (histórico do pedido, histórico da curadoria).
// Devolve só os itens: quem usa decide o espaçamento (Stack) em volta.
export function Timeline({ eventos }: { eventos: EventoTimeline[] }) {
  return (
    <>
      {eventos.map((evento) => (
        <Box key={evento.titulo} borderLeftWidth="2px" borderColor="origem.laranja" ps="3">
          <Text fontWeight="bold" fontSize="sm">{evento.titulo}</Text>
          <Text textStyle="apoio">{formatDateTime(evento.data)}</Text>
        </Box>
      ))}
    </>
  )
}
