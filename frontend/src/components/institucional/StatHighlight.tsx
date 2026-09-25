import { Stack, Text } from "@chakra-ui/react"

type StatHighlightProps = {
  value: string
  label: string
}

export function StatHighlight({ value, label }: StatHighlightProps) {
  return (
    <Stack align="center" gap={1} flex="1">
      <Text fontFamily="heading" fontSize="5xl" color="origem.laranja" lineHeight="1">
        {value}
      </Text>
      <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="origem.texto" textAlign="center">
        {label}
      </Text>
    </Stack>
  )
}
