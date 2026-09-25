import { Flex, Heading, Stack, Text } from "@chakra-ui/react"
import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"

type PageHeaderProps = {
  trilha?: { label: string; href?: string }[]   // breadcrumb, ex.: [{ label: "Home", href: "/" }, { label: "Catálogo" }]
  titulo: string
  subtitulo?: string
  children?: React.ReactNode  // ações à direita (botões)
}

// Topo das páginas: breadcrumb, título grande e subtítulo.
export function PageHeader({ trilha, titulo, subtitulo, children }: PageHeaderProps) {
  return (
    <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "flex-end" }} gap="4" mb="8">
      <Stack gap="2">
        {trilha && <PageBreadcrumb items={trilha} />}
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
