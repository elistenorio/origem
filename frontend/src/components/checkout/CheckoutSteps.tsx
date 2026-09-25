import { Steps } from "@chakra-ui/react"

const ETAPAS = ["Carrinho", "Identificação e pagamento", "Confirmação"]

// Indicador de etapas do checkout (visual na recipe "steps").
export function CheckoutSteps({ atual }: { atual: number }) {
  return (
    <Steps.Root step={atual} count={ETAPAS.length} size="sm" mb="8">
      <Steps.List>
        {ETAPAS.map((titulo, i) => (
          <Steps.Item key={titulo} index={i} title={titulo}>
            <Steps.Indicator />
            <Steps.Title display={{ base: i === atual ? "block" : "none", md: "block" }}>{titulo}</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>
    </Steps.Root>
  )
}
