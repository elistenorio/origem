import { Box, Grid, Heading, Separator, Stack, Text } from "@chakra-ui/react"
import { BiFile } from "react-icons/bi"
import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { TableOfContents } from "@/components/institucional/TableOfContents"

const SECOES = [
  {
    id: "apresentacao",
    titulo: "1. Apresentação",
    texto:
      "O Origem é um marketplace que conecta artesãos e produtores criativos a compradores, com foco na origem, na técnica e no impacto de comprar de quem faz.",
  },
  {
    id: "definicao-da-plataforma",
    titulo: "2. Definição da plataforma",
    texto:
      "A plataforma oferece vitrine para compradores, painel para artesãos e painel administrativo. O Origem intermedia a venda, mas cada peça é produzida e enviada pelo próprio artesão.",
  },
  {
    id: "cadastro",
    titulo: "3. Cadastro",
    texto: "Para comprar ou vender é preciso fornecer informações verdadeiras e mantê-las atualizadas. Artesãos passam por curadoria antes de publicar peças.",
    lista: [
      "Você é responsável por manter sua senha em sigilo.",
      "Contas com dados falsos podem ser suspensas.",
    ],
  },
  {
    id: "responsabilidades-do-usuario",
    titulo: "4. Responsabilidades do usuário",
    texto: "Usar a plataforma de forma ética, sem publicar conteúdo ofensivo, falso ou que viole direitos de terceiros.",
  },
  {
    id: "compra-e-venda",
    titulo: "5. Compra e venda",
    texto:
      "O contrato de compra é firmado entre comprador e artesão, com intermediação do Origem. Preços, prazos e fretes são informados antes da finalização do pedido.",
  },
  {
    id: "conteudo",
    titulo: "6. Conteúdo",
    texto: "Fotos e descrições publicadas pelos artesãos são de responsabilidade deles e passam por revisão da curadoria.",
  },
  {
    id: "propriedade-intelectual",
    titulo: "7. Propriedade intelectual",
    texto: "A marca Origem, o layout e os textos institucionais pertencem ao Origem. As criações e imagens das peças pertencem aos respectivos artesãos.",
  },
  {
    id: "pagamentos",
    titulo: "8. Pagamentos",
    texto: "Os pagamentos são processados por intermediador certificado. O repasse ao artesão ocorre após a confirmação da entrega.",
  },
  {
    id: "cancelamentos",
    titulo: "9. Cancelamentos",
    texto:
      "O comprador pode cancelar o pedido antes do envio ou exercer o direito de arrependimento em até 7 dias após o recebimento, conforme o Código de Defesa do Consumidor.",
  },
  {
    id: "alteracoes-dos-termos",
    titulo: "10. Alterações dos termos",
    texto: "Podemos atualizar estes termos. Mudanças relevantes serão comunicadas por e-mail e na plataforma com antecedência mínima de 15 dias.",
  },
  {
    id: "contato",
    titulo: "11. Contato",
    texto: "Dúvidas sobre estes termos: contato@origem.com ou WhatsApp (81) 90000-0000.",
  },
]

export default function TermosDeUsoPage() {
  return (
    <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Institucional" },
          { label: "Termos de uso" },
        ]}
      />

      <Box mt={6} mb={8}>
        <Heading as="h1" variant="titulo" fontSize={{ base: "3xl", md: "5xl" }} mb={2}>
          Termos de uso
        </Heading>
        <Text color="origem.textoSuave" fontSize="sm">
          Última atualização: 25 de setembro de 2026
        </Text>
      </Box>

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
          <TableOfContents items={SECOES.map((secao) => ({ id: secao.id, label: secao.titulo }))} />
          <Separator borderColor="origem.busca" />
          {/* Sem arquivo real ainda — só o visual do atalho */}
          <Text as="span" display="flex" alignItems="center" gap={2} color="origem.texto" fontWeight="medium" fontSize="sm">
            <BiFile /> Baixar em PDF
          </Text>
        </Stack>

        <Stack gap={8}>
          <Text color="origem.texto">
            Estes Termos de Uso regulam o acesso e a utilização da plataforma O.R.I.G.E.M. Ao criar
            uma conta ou realizar uma compra, você declara que leu e concorda com as condições
            abaixo.
          </Text>

          {SECOES.map((secao) => (
            <Box key={secao.id} id={secao.id} scrollMarginTop="24px">
              <Heading as="h3" variant="destaque" fontSize="lg" mb={2}>
                {secao.titulo}
              </Heading>
              <Text color="origem.texto">{secao.texto}</Text>
              {secao.lista && (
                <Box as="ul" mt={2} pl={5} color="origem.texto">
                  {secao.lista.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      </Grid>
    </Box>
  )
}
