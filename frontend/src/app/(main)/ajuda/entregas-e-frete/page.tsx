import { Box, Grid, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { BiErrorAlt } from "react-icons/bi"
import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { InfoBox } from "@/components/ajuda/InfoBox"
import { RegionCard } from "@/components/ajuda/RegionCard"
import { FreightCalculator } from "@/components/common/FreightCalculator"

const REGIOES = [
  { title: "Pernambuco", range: "2 a 5 dias", caption: "úteis, em média" },
  { title: "Nordeste", range: "4 a 8 dias", caption: "úteis, em média" },
  { title: "Sudeste e Sul", range: "6 a 12 dias", caption: "úteis, em média" },
  { title: "Norte e Centro-Oeste", range: "8 a 15 dias", caption: "úteis, em média" },
]

export default function EntregasEFretePage() {
  return (
    <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Ajuda" },
          { label: "Entregas e frete" },
        ]}
      />

      <Box mt={6} mb={8}>
        <Heading as="h1" variant="titulo" fontSize={{ base: "3xl", md: "5xl" }} mb={2}>
          Entregas e frete
        </Heading>
        <Text color="origem.texto">
          As peças são enviadas pelos próprios artesãos, com embalagem reforçada e rastreamento.
        </Text>
      </Box>

      <Grid templateColumns={{ base: "1fr", lg: "1.6fr 1fr" }} gap={10}>
        <Stack gap={8}>
          <Box>
            <Heading as="h2" variant="destaque" fontSize="xl" mb={3}>Regiões atendidas</Heading>
            <Text color="origem.texto" mb={5}>
              Entregamos em todo o Brasil pelos Correios. Em Recife e Região Metropolitana, alguns
              artesãos oferecem entrega própria ou retirada combinada.
            </Text>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
              {REGIOES.map((regiao) => (
                <RegionCard key={regiao.title} {...regiao} />
              ))}
            </SimpleGrid>
          </Box>

          <Box>
            <Heading as="h2" variant="destaque" fontSize="xl" mb={3}>Prazos e modalidades</Heading>
            <Text color="origem.texto">
              O prazo total soma o tempo de postagem informado pelo artesão (até 3 dias úteis para
              peças a pronta entrega) e o prazo da transportadora. Peças sob encomenda mostram o
              prazo de produção na página da peça.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" variant="destaque" fontSize="xl" mb={3}>Rastreamento</Heading>
            <Text color="origem.texto">
              Assim que o artesão postar a peça, você recebe o código de rastreio por e-mail e pode
              acompanhar tudo em Minha conta &gt; Meus pedidos.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" variant="destaque" fontSize="xl" mb={3}>Responsabilidades</Heading>
            <Text color="origem.texto">
              O artesão é responsável por embalar a peça com segurança e postá-la no prazo. O
              Origem acompanha cada envio e intermedia qualquer problema com a transportadora.
            </Text>
          </Box>

          <InfoBox icon={BiErrorAlt} title="Atrasos na entrega" tone="aviso">
            Se o pedido passar do prazo estimado, fale com a gente. Entramos em contato com o
            artesão e a transportadora e, se a peça não chegar, você recebe o reembolso integral.
          </InfoBox>
        </Stack>

        <Box>
          <FreightCalculator />
        </Box>
      </Grid>
    </Box>
  )
}
