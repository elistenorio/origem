import { Box, type BoxProps } from "@chakra-ui/react"

// Bloco base reaproveitado pelos cards pequenos (RegionCard, StepCard, ValueCard,
// TimeframeCard, ChecklistCard, PaymentMethodCard, CatalogItemCard): só o fundo,
// os cantos e o espaçamento padrão do design. O layout de dentro (Stack, HStack...)
// fica por conta de quem usa — o Tile não impõe direção de conteúdo.
export function Tile({ p = 6, ...rest }: BoxProps) {
  return <Box bg="origem.passoFundo" borderRadius="xl" p={p} {...rest} />
}
