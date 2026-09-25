import { EmptyState, VStack } from "@chakra-ui/react"
import { BiSearchAlt } from "react-icons/bi"

type EmptyMessageProps = {
  titulo: string
  descricao?: string
  children?: React.ReactNode   // ação opcional (ex.: botão "Limpar filtros")
}

export function EmptyMessage({ titulo, descricao, children }: EmptyMessageProps) {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <BiSearchAlt />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>{titulo}</EmptyState.Title>
          {descricao && <EmptyState.Description>{descricao}</EmptyState.Description>}
        </VStack>
        {children}
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
