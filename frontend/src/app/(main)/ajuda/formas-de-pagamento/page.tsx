import { Box, Grid, Heading, HStack, Separator, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { BiCreditCard, BiFile, BiTransferAlt } from "react-icons/bi"
import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { SectionCard } from "@/components/common/SectionCard"
import { formatCurrency } from "@/utils/formatCurrency"
import { PaymentMethodCard } from "@/components/ajuda/PaymentMethodCard"

const METODOS = [
  {
    icon: BiCreditCard,
    title: "Cartão de crédito",
    description: "Visa, Mastercard, Elo, American Express e Hipercard.",
    items: [
      "Até 6x sem juros (parcela mínima de R$ 30)",
      "Aprovação em poucos minutos",
      "Dados protegidos, não ficam salvos sem sua autorização",
    ],
  },
  {
    icon: BiTransferAlt,
    title: "Pix",
    description: "Pagamento instantâneo pelo app do seu banco.",
    items: [
      "QR Code ou código copia e cola",
      "Confirmação em até 5 minutos",
      "O código expira em 30 minutos",
    ],
  },
  {
    icon: BiFile,
    title: "Boleto bancário",
    description: "Disponível para compras acima de R$ 50.",
    items: [
      "Vencimento em 2 dias úteis",
      "Compensação em até 3 dias úteis",
      "Peças únicas ficam reservadas até a compensação",
    ],
  },
]

const VALOR_EXEMPLO = 335.8
const PARCELAS = [1, 2, 3, 6]

const PRAZOS_CONFIRMACAO = [
  { forma: "Pix", prazo: "até 5 minutos" },
  { forma: "Cartão de crédito", prazo: "até 2 horas" },
  { forma: "Boleto", prazo: "até 3 dias úteis" },
]


export default function FormasDePagamentoPage() {
  return (
    <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Ajuda" },
          { label: "Formas de pagamento" },
        ]}
      />

      <Box mt={6} mb={8}>
        <Heading as="h1" variant="titulo" fontSize={{ base: "3xl", md: "5xl" }} mb={2}>
          Formas de pagamento
        </Heading>
        <Text color="origem.texto">
          Pague do jeito que preferir, com segurança em todas as etapas.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
        {METODOS.map((metodo) => (
          <PaymentMethodCard key={metodo.title} {...metodo} />
        ))}
      </SimpleGrid>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} mb={10}>
        <SectionCard title="Parcelamento no cartão">
          <Text fontSize="sm" color="origem.textoSuave" mt={-2}>
            Exemplo para uma compra de {formatCurrency(VALOR_EXEMPLO)}
          </Text>
          <Stack gap={0}>
            {PARCELAS.map((parcela, index) => (
              <HStack
                key={parcela}
                justify="space-between"
                py={3}
                borderTopWidth={index === 0 ? "1px" : "0"}
                borderBottomWidth="1px"
                borderColor="origem.busca"
              >
                <HStack gap={4}>
                  <Text fontWeight="bold" color="origem.texto">{parcela}x</Text>
                  <Text color="origem.texto">{formatCurrency(VALOR_EXEMPLO / parcela)}</Text>
                </HStack>
                <Text fontSize="sm" color="origem.textoSuave">sem juros</Text>
              </HStack>
            ))}
          </Stack>
        </SectionCard>

        <SectionCard title="Prazo de confirmação">
          <Stack gap={3}>
            {PRAZOS_CONFIRMACAO.map((item) => (
              <HStack key={item.forma} justify="space-between">
                <Text color="origem.texto">{item.forma}</Text>
                <Text fontWeight="bold" color="origem.laranja">{item.prazo}</Text>
              </HStack>
            ))}
          </Stack>
          <Separator borderColor="origem.busca" />
          <Text fontSize="xs" color="origem.textoSuave">
            O artesão só começa a separar a peça depois que o pagamento é aprovado.
          </Text>
        </SectionCard>
      </Grid>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={10}>
        <Box>
          <Heading as="h2" variant="destaque" fontSize="xl" mb={3}>Segurança</Heading>
          <Text color="origem.texto">
            Todas as transações são criptografadas e processadas por um intermediador certificado
            PCI-DSS. O Origem não armazena os dados completos do seu cartão.
          </Text>
        </Box>
        <Box>
          <Heading as="h2" variant="destaque" fontSize="xl" mb={3}>Cobrança e aprovação</Heading>
          <Text color="origem.texto">
            Na fatura, a compra aparece como ORIGEM*NOME DO ARTESÃO. Se o pagamento for recusado,
            avisamos por e-mail e você pode tentar outra forma sem perder a reserva por 30 minutos.
          </Text>
        </Box>
      </Grid>
    </Box>
  )
}
