import { Box, Grid, Heading, Separator, Stack, Text } from "@chakra-ui/react"
import { BiFile } from "react-icons/bi"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { TableOfContents } from "@/components/institucional/TableOfContents"

export type LegalSection = {
  id: string
  titulo: string
  conteudo: React.ReactNode // corpo já pronto: texto, lista, tabela, painel...
}

type LegalPageLayoutProps = {
  breadcrumbAtual: string
  titulo: string
  atualizadoEm: string
  intro?: React.ReactNode
  secoes: LegalSection[]
}

// Casco compartilhado das páginas institucionais longas (Termos de uso,
// Política de privacidade, Política de cookies): breadcrumb, título, sumário
// lateral com destaque de leitura e as seções numeradas.
export function LegalPageLayout({ breadcrumbAtual, titulo, atualizadoEm, intro, secoes }: LegalPageLayoutProps) {
  return (
    <PageContainer>
      <PageHeader
        trilha={[{ label: "Home", href: "/" }, { label: "Institucional" }, { label: breadcrumbAtual }]}
        titulo={titulo}
      />
      <Text color="origem.textoSuave" fontSize="sm" mt={-6} mb={8}>
        Última atualização: {atualizadoEm}
      </Text>

      <Grid templateColumns={{ base: "1fr", lg: "260px 1fr" }} gap={10} alignItems="flex-start">
        <Stack
          bg="origem.passoFundo"
          borderRadius="xl"
          p={6}
          gap={4}
          position={{ lg: "sticky" }}
          top={{ lg: "24px" }}
        >
          <Heading as="h2" variant="secao" fontSize="sm">Nesta página</Heading>
          <TableOfContents items={secoes.map((secao) => ({ id: secao.id, label: secao.titulo }))} />
          <Separator borderColor="origem.busca" />
          {/* Sem arquivo real ainda — só o visual do atalho */}
          <Text as="span" display="flex" alignItems="center" gap={2} color="origem.texto" fontWeight="medium" fontSize="sm">
            <BiFile /> Baixar em PDF
          </Text>
        </Stack>

        <Stack gap={8}>
          {intro && <Text color="origem.texto">{intro}</Text>}
          {secoes.map((secao) => (
            <Box key={secao.id} id={secao.id} scrollMarginTop="24px">
              <Heading as="h3" variant="destaque" fontSize="lg" mb={2}>
                {secao.titulo}
              </Heading>
              {secao.conteudo}
            </Box>
          ))}
        </Stack>
      </Grid>
    </PageContainer>
  )
}
