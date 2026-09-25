import { Spinner, Text, VStack } from "@chakra-ui/react"

export function LoadingState({ mensagem = "Carregando..." }: { mensagem?: string }) {
  return (
    <VStack py="16" gap="3" role="status" aria-live="polite">
      <Spinner color="origem.laranja" size="lg" />
      <Text textStyle="apoio">{mensagem}</Text>
    </VStack>
  )
}
