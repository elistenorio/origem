import { Text, type TextProps } from "@chakra-ui/react"
import { splitCurrency } from "@/utils/formatCurrency"

type PriceProps = TextProps & { valor: number }

// "R$ 167,90" com os centavos menores, como no design.
export function Price({ valor, ...rest }: PriceProps) {
  const { inteiro, centavos } = splitCurrency(valor)
  return (
    <Text textStyle="preco" {...rest}>
      R$ {inteiro},
      <Text as="span" fontSize="0.6em">
        {centavos}
      </Text>
    </Text>
  )
}
