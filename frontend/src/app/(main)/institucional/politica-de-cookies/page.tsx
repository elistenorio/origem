import { Table, Text } from "@chakra-ui/react"
import { LegalPageLayout, type LegalSection } from "@/components/institucional/LegalPageLayout"
import { CookiePreferencesPanel } from "@/components/institucional/CookiePreferencesPanel"

const TIPOS_DE_COOKIE = [
  { tipo: "Essenciais", exemplo: "origem_sessao", finalidade: "Manter você conectado e o carrinho salvo", duracao: "Sessão" },
  { tipo: "Desempenho", exemplo: "_ga", finalidade: "Entender como a plataforma é usada", duracao: "13 meses" },
  { tipo: "Funcionais", exemplo: "origem_pref", finalidade: "Lembrar preferências, como filtros e CEP", duracao: "12 meses" },
  { tipo: "Marketing", exemplo: "_fbp", finalidade: "Mostrar anúncios relevantes em outras redes", duracao: "3 meses" },
]

const SECOES: LegalSection[] = [
  {
    id: "o-que-sao-cookies",
    titulo: "1. O que são cookies",
    conteudo: (
      <Text color="origem.texto">
        Cookies são pequenos arquivos salvos no seu navegador quando você visita um site. Eles
        ajudam o site a lembrar informações sobre a sua visita.
      </Text>
    ),
  },
  {
    id: "tipos-utilizados",
    titulo: "2. Tipos utilizados",
    conteudo: (
      <>
        <Text color="origem.texto" mb={4}>Usamos os tipos de cookies descritos na tabela abaixo.</Text>
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader color="origem.texto">Tipo</Table.ColumnHeader>
              <Table.ColumnHeader color="origem.texto">Exemplo</Table.ColumnHeader>
              <Table.ColumnHeader color="origem.texto">Finalidade</Table.ColumnHeader>
              <Table.ColumnHeader color="origem.texto">Duração</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {TIPOS_DE_COOKIE.map((linha) => (
              <Table.Row key={linha.tipo}>
                <Table.Cell fontWeight="bold" color="origem.texto">{linha.tipo}</Table.Cell>
                <Table.Cell color="origem.textoSuave">{linha.exemplo}</Table.Cell>
                <Table.Cell color="origem.textoSuave">{linha.finalidade}</Table.Cell>
                <Table.Cell color="origem.textoSuave">{linha.duracao}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </>
    ),
  },
  {
    id: "finalidade",
    titulo: "3. Finalidade",
    conteudo: (
      <Text color="origem.texto">
        Manter sua sessão ativa, salvar o carrinho, lembrar preferências, medir o desempenho e,
        com seu consentimento, personalizar anúncios.
      </Text>
    ),
  },
  {
    id: "cookies-essenciais-e-opcionais",
    titulo: "4. Cookies essenciais e opcionais",
    conteudo: (
      <Text color="origem.texto">
        Cookies essenciais são necessários para o funcionamento do site e não dependem de
        consentimento. Os demais são opcionais e só são usados se você permitir.
      </Text>
    ),
  },
  {
    id: "gerenciamento-de-preferencias",
    titulo: "5. Gerenciamento de preferências",
    conteudo: (
      <>
        <Text color="origem.texto" mb={4}>
          Você pode alterar suas escolhas a qualquer momento abaixo ou pelo link &ldquo;Preferências
          de cookies&rdquo; no rodapé.
        </Text>
        <CookiePreferencesPanel />
      </>
    ),
  },
  {
    id: "duracao",
    titulo: "6. Duração",
    conteudo: (
      <Text color="origem.texto">
        Cookies de sessão são apagados ao fechar o navegador. Os persistentes duram de 3 a 13
        meses, conforme a tabela.
      </Text>
    ),
  },
  {
    id: "terceiros",
    titulo: "7. Terceiros",
    conteudo: (
      <Text color="origem.texto">
        Alguns cookies são definidos por parceiros, como Google Analytics e Meta, que seguem as
        próprias políticas de privacidade.
      </Text>
    ),
  },
  {
    id: "como-desativar",
    titulo: "8. Como desativar",
    conteudo: (
      <Text color="origem.texto">
        Além das preferências acima, você pode bloquear ou apagar cookies nas configurações do
        seu navegador. Bloquear cookies essenciais pode impedir o funcionamento do carrinho e do
        login.
      </Text>
    ),
  },
  {
    id: "atualizacao-da-politica",
    titulo: "9. Atualização da política",
    conteudo: (
      <Text color="origem.texto">
        Esta política pode ser atualizada. A data da última atualização aparece no topo da
        página.
      </Text>
    ),
  },
]

export default function PoliticaDeCookiesPage() {
  return (
    <LegalPageLayout
      breadcrumbAtual="Política de cookies"
      titulo="Política de cookies"
      atualizadoEm="25 de setembro de 2026"
      intro="Esta política explica o que são cookies, quais usamos no Origem e como você pode gerenciar suas preferências."
      secoes={SECOES}
    />
  )
}
