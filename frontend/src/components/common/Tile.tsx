import { Card, type CardRootProps } from "@chakra-ui/react"

// Bloco base reaproveitado pelos cards pequenos (RegionCard, StepCard, ValueCard,
// TimeframeCard, ChecklistCard, PaymentMethodCard, CatalogItemCard, StatCard,
// SectionCard): só o fundo, os cantos e o espaçamento padrão do design, agora vindos
// da recipe "card" (variante "origem"). O layout de dentro (Stack, HStack...) fica
// por conta de quem usa — o Tile não impõe direção de conteúdo nem usa os slots de
// header/body/footer do Card, só a raiz.
export function Tile({ p = 6, ...rest }: Omit<CardRootProps, "variant">) {
  return <Card.Root variant="origem" p={p} {...rest} />
}
