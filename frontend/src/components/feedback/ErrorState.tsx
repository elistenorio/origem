import { Button, EmptyState, VStack } from "@chakra-ui/react"
import { BiErrorCircle } from "react-icons/bi"

type ErrorStateProps = {
  mensagem: string          // mensagem do ApiError
  onRetry?: () => void
}

export function ErrorState({ mensagem, onRetry }: ErrorStateProps) {
  return (
    <EmptyState.Root role="alert">
      <EmptyState.Content>
        <EmptyState.Indicator>
          <BiErrorCircle />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>Não foi possível carregar</EmptyState.Title>
          <EmptyState.Description>{mensagem}</EmptyState.Description>
        </VStack>
        {onRetry && (
          <Button variant="origem" onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
