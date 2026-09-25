import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react"

type Serie = { nome: string; cor: "origem.laranja" | "origem.marrom" }

type ColumnChartProps = {
  titulo: string                                   // descrição para leitores de tela
  rotulos: string[]                                // eixo X (meses, semanas)
  series: (Serie & { valores: number[] })[]        // 1 ou 2 séries (atual x anterior)
  formatar?: (valor: number) => string
  altura?: string
}

// Colunas verticais (uma ou duas séries lado a lado), com legenda e valor no título de cada coluna.
export function ColumnChart({ titulo, rotulos, series, formatar = String, altura = "200px" }: ColumnChartProps) {
  const max = Math.max(...series.flatMap((s) => s.valores), 1)
  return (
    <Stack gap="3">
      {series.length > 1 && (
        <HStack gap="5" wrap="wrap">
          {series.map((s) => (
            <HStack key={s.nome} gap="2">
              <Box boxSize="3" borderRadius="sm" bg={s.cor} />
              <Text fontSize="sm">{s.nome}</Text>
            </HStack>
          ))}
        </HStack>
      )}
      <Flex role="img" aria-label={titulo} align="flex-end" gap={{ base: "1", md: "2" }} h={altura} borderBottomWidth="1px" borderColor="origem.marrom">
        {rotulos.map((rotulo, i) => (
          <Flex key={rotulo} flex="1" align="flex-end" justify="center" gap="0.5" h="full">
            {series.map((s) => (
              <Box key={s.nome} flex="1" maxW="8" bg={s.cor} borderTopRadius="sm" h={`${(s.valores[i] / max) * 100}%`} title={`${rotulo} · ${s.nome}: ${formatar(s.valores[i])}`} />
            ))}
          </Flex>
        ))}
      </Flex>
      <Flex gap={{ base: "1", md: "2" }}>
        {rotulos.map((rotulo) => (
          <Text key={rotulo} flex="1" textAlign="center" textStyle="apoio" fontSize="xs">{rotulo}</Text>
        ))}
      </Flex>
    </Stack>
  )
}
