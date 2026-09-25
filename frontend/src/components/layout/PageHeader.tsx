import { Flex, Heading, Stack, Text } from "@chakra-ui/react"

type PageHeaderProps = {
  caminho?: string            // ex.: "Home / Catálogo"
  titulo: string
  subtitulo?: string
  children?: React.ReactNode  // ações à direita (botões)
}

// Topo das páginas: caminho, título grande e subtítulo.
export function PageHeader({ caminho, titulo, subtitulo, children }: PageHeaderProps) {
  return (
    <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "flex-end" }} gap="4" mb="8">
      <Stack gap="2">
        {caminho && <Text textStyle="apoio">{caminho}</Text>}
        <Heading as="h1" variant="titulo" fontSize={{ base: "4xl", md: "6xl" }} lineHeight="1">
          {titulo}
        </Heading>
        {subtitulo && (
          <Text fontSize={{ base: "md", md: "lg" }} maxW="3xl">
            {subtitulo}
          </Text>
        )}
      </Stack>
      {children}
    </Flex>
  )
}
