import { Stack, Text } from "@chakra-ui/react"
import { Tile } from "@/components/common/Tile"

type RegionCardProps = {
  title: string
  range: string // ex.: "2 a 5 dias"
  caption: string // ex.: "úteis, em média"
}

export function RegionCard({ title, range, caption }: RegionCardProps) {
  return (
    <Tile p={5}>
      <Stack gap={1}>
        <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" color="origem.texto">
          {title}
        </Text>
        <Text fontFamily="heading" fontSize="3xl" color="origem.laranja" lineHeight="1">
          {range}
        </Text>
        <Text fontSize="xs" color="origem.textoSuave">
          {caption}
        </Text>
      </Stack>
    </Tile>
  )
}
