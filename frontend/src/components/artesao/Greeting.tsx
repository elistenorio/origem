import { Text } from "@chakra-ui/react"

// Saudação "Olá," do topo do dashboard e do perfil do artesão (mesmo texto, dois lugares).
export function Greeting({ mb = -1 }: { mb?: number }) {
  return (
    <Text fontSize="xl" color="origem.textoSuave" mb={mb}>
      Olá,
    </Text>
  )
}
