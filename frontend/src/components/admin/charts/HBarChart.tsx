import { Box, Flex, Stack, Text } from "@chakra-ui/react"

type HBarChartProps = {
  dados: { rotulo: string; valor: number }[]
  formatar?: (valor: number) => string
  titulo: string    // descrição para leitores de tela
}

// Barras horizontais (uma série): vendas por categoria, principais categorias.
export function HBarChart({ dados, formatar = String, titulo }: HBarChartProps) {
  const max = Math.max(...dados.map((d) => d.valor), 1)
  return (
    <Stack gap="3" role="img" aria-label={`${titulo}: ${dados.map((d) => `${d.rotulo} ${formatar(d.valor)}`).join(", ")}`}>
      {dados.map((d) => (
        <Flex key={d.rotulo} align="center" gap="3">
          <Text fontSize="sm" w={{ base: "110px", md: "150px" }} flexShrink={0}>{d.rotulo}</Text>
          <Flex flex="1" align="center" gap="2">
            <Box h="4" bg="origem.laranja" borderEndRadius="sm" w={`${(d.valor / max) * 100}%`} minW="1" title={`${d.rotulo}: ${formatar(d.valor)}`} />
            <Text fontSize="sm" fontWeight="bold" flexShrink={0}>{formatar(d.valor)}</Text>
          </Flex>
        </Flex>
      ))}
    </Stack>
  )
}
