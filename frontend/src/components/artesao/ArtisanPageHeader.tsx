import { Flex, Heading, Stack, Text } from "@chakra-ui/react"

type ArtisanPageHeaderProps = { titulo: string; descricao?: string; children?: React.ReactNode }

// Cabeçalho das telas do painel do artesão (título em seção + ações).
export function ArtisanPageHeader({ titulo, descricao, children }: ArtisanPageHeaderProps) {
  return (
    <Flex justify="space-between" align={{ base: "stretch", md: "flex-start" }} direction={{ base: "column", md: "row" }} gap="4" mb="8">
      <Stack gap="2" maxW="xl">
        <Heading as="h1" variant="secao" fontSize="2xl">{titulo}</Heading>
        {descricao && <Text textStyle="apoio">{descricao}</Text>}
      </Stack>
      {children}
    </Flex>
  )
}
