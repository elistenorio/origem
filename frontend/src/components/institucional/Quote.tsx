import { Stack, Text } from "@chakra-ui/react"

type QuoteProps = {
  children: React.ReactNode // a fala, sem aspas
  author: string
}

export function Quote({ children, author }: QuoteProps) {
  return (
    <Stack bg="origem.fundo" borderRadius="xl" p={6} gap={3} justify="center">
      <Text fontSize="lg" fontWeight="medium" color="origem.texto">
        &ldquo;{children}&rdquo;
      </Text>
      <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="origem.textoSuave">
        {author}
      </Text>
    </Stack>
  )
}
