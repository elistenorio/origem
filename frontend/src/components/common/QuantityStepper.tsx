import { HStack, IconButton, Text } from "@chakra-ui/react"
import { BiMinus, BiPlus } from "react-icons/bi"

type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  max?: number
  label?: string
}

// Seletor "- 1 +" de quantidade (carrinho, detalhes da peça).
export function QuantityStepper({ value, onChange, max = Infinity, label = "Quantidade" }: QuantityStepperProps) {
  return (
    <HStack gap="1" bg="origem.busca" borderRadius="full" w="fit-content" p="1" role="group" aria-label={label}>
      <IconButton aria-label="Diminuir" variant="ghost" size="lg" borderRadius="full" color="origem.laranja" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <BiMinus />
      </IconButton>
      <Text minW="10" textAlign="center" fontWeight="bold" fontSize="xl" aria-live="polite">
        {value}
      </Text>
      <IconButton aria-label="Aumentar" variant="ghost" size="lg" borderRadius="full" color="origem.laranja" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <BiPlus />
      </IconButton>
    </HStack>
  )
}
