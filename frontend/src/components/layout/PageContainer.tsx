import { Container, type ContainerProps } from "@chakra-ui/react"

// Largura e margens padrão do conteúdo das páginas.
export function PageContainer(props: ContainerProps) {
  return <Container maxW="7xl" px={{ base: "4", md: "8" }} py={{ base: "6", md: "10" }} {...props} />
}
