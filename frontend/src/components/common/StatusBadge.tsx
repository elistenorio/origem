import { Badge, type BadgeProps } from "@chakra-ui/react"

type Tone = "sucesso" | "aviso" | "perigo" | "info" | "neutro"

// Mapa "status -> (rótulo, tom de cor)". Cobre os selos vistos no design
// (pedido, estoque, cadastro). As cores de cada tom ficam em theme/recipes/badge.ts;
// ajustar lá se o design tiver valores exatos diferentes.
const STATUS = {
  publicado: { label: "Publicado", tone: "sucesso" },
  emAnalise: { label: "Em análise", tone: "neutro" },
  vendida: { label: "Vendida", tone: "info" },
  indisponivel: { label: "Indisponível", tone: "neutro" },
  rascunho: { label: "Rascunho", tone: "neutro" },
  esgotado: { label: "Esgotado", tone: "perigo" },
  baixoEstoque: { label: "Baixo estoque", tone: "perigo" },
  emSeparacao: { label: "Em separação", tone: "info" },
  ajustesSolicitados: { label: "Ajustes solicitados", tone: "aviso" },
  processando: { label: "Processando", tone: "aviso" },
  enviado: { label: "Enviado", tone: "info" },
  entregue: { label: "Entregue", tone: "sucesso" },
  cancelado: { label: "Cancelado", tone: "neutro" },
  aprovada: { label: "Aprovada", tone: "sucesso" },
  recusado: { label: "Recusado", tone: "perigo" },
  disponivel: { label: "Disponível", tone: "sucesso" },
  ultimasUnidades: { label: "Últimas unidades", tone: "aviso" },
} as const satisfies Record<string, { label: string; tone: Tone }>

export type StatusKey = keyof typeof STATUS

type StatusBadgeProps = Omit<BadgeProps, "variant" | "children"> & {
  status: StatusKey
}

export function StatusBadge({ status, ...rest }: StatusBadgeProps) {
  const { label, tone } = STATUS[status]
  return (
    <Badge variant={tone} {...rest}>
      {label}
    </Badge>
  )
}
