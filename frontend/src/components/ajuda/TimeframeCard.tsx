import { Stack, Text } from "@chakra-ui/react"
import { Tile } from "@/components/common/Tile"

type TimeframeCardProps = {
  value: string // ex.: "7 dias", "48 horas"
  title: string
  description: string
}

// Igual ao RegionCard, só que o valor vem antes do título (ordem que o design usa aqui).
export function TimeframeCard({ value, title, description }: TimeframeCardProps) {
  return (
    <Tile>
      <Stack gap={2}>
        <Text fontFamily="heading" fontSize="3xl" color="origem.laranja" lineHeight="1">
          {value}
        </Text>
        <Text fontWeight="bold" textTransform="uppercase" fontSize="sm" color="origem.texto">
          {title}
        </Text>
        <Text fontSize="sm" color="origem.textoSuave">
          {description}
        </Text>
      </Stack>
    </Tile>
  )
}
