import { Box, HStack } from "@chakra-ui/react"

type StepIndicatorProps = {
  total: number   // quantas etapas existem
  current: number // etapa atual (começa em 1)
}

export function StepIndicator({ total, current }: StepIndicatorProps) {
  return (
    <HStack
      gap="2"
      bg="origem.passoFundo"
      borderRadius="full"
      px="3"
      py="2"
      w="fit-content"
      mx="auto"
      role="img"
      aria-label={`Etapa ${current} de ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <Box
          key={index}
          boxSize="2.5"
          borderRadius="full"
          bg={index + 1 === current ? "origem.laranja" : "origem.passoInativo"}
        />
      ))}
    </HStack>
  )
}