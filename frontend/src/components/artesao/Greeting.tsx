import { Text } from "@chakra-ui/react"

// Rótulo "OLÁ," do topo do dashboard e do perfil do artesão (mesmo texto, dois lugares).
export function Greeting({ mb = -1 }: { mb?: number }) {
  return (
    <Text textTransform="uppercase" fontSize="sm" color="origem.texto" mb={mb}>
      OLÁ,
    </Text>
  )
}
