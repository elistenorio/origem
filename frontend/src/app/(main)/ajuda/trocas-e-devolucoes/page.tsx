import { Box, Grid, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { BiCar, BiCreditCard, BiErrorAlt, BiImage, BiPackage } from "react-icons/bi"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/layout/PageHeader"
import { InfoBox } from "@/components/ajuda/InfoBox"
import { TimeframeCard } from "@/components/ajuda/TimeframeCard"
import { ChecklistCard } from "@/components/ajuda/ChecklistCard"
import { StepCard } from "@/components/ajuda/StepCard"

const PRAZOS = [
  {
    value: "7 dias",
    title: "Arrependimento",
    description: "para desistir da compra após o recebimento, sem precisar justificar.",
  },
  {
    value: "30 dias",
    title: "Defeito de fabricação",
    description: "para solicitar troca ou reembolso de peças com defeito.",
  },
  {
    value: "48 horas",
    title: "Peça danificada",
    description: "para avisar se a peça chegou quebrada ou avariada no transporte.",
  },
]

const PODEM = [
  "Peças sem sinais de uso, na embalagem original",
  "Peças com defeito de fabricação",
  "Peças diferentes do anúncio (cor, tamanho ou material)",
  "Peças danificadas no transporte",
]

const NAO_PODEM = [
  "Peças feitas sob encomenda e personalizadas",
  "Peças com sinais de uso ou quebradas pelo cliente",
  "Pequenas variações de cor e textura, próprias do feito à mão",
  "Solicitações fora dos prazos acima",
]

const PASSOS = [
  {
    icon: BiPackage,
    number: "01",
    title: "Acesse Meus pedidos",
    description: 'Em Minha conta, escolha o pedido e clique em "Solicitar troca ou devolução".',
  },
  {
    icon: BiImage,
    number: "02",
    title: "Conte o que aconteceu",
    description: "Escolha o motivo e envie fotos da peça e da embalagem.",
  },
  {
    icon: BiCar,
    number: "03",
    title: "Envie a peça",
    description: "Você recebe um código de postagem para enviar a peça pelos Correios.",
  },
  {
    icon: BiCreditCard,
    number: "04",
    title: "Receba o reembolso",
    description: "Após a análise, o valor volta em até 10 dias úteis na mesma forma de pagamento.",
  },
]

export default function TrocasEDevolucoesPage() {
  return (
    <PageContainer>
      <PageHeader
        trilha={[{ label: "Home", href: "/" }, { label: "Ajuda" }, { label: "Trocas e devoluções" }]}
        titulo="Trocas e devoluções"
        subtitulo="Queremos que você ame sua peça. Se algo não sair como esperado, veja como resolver."
      />

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
        {PRAZOS.map((prazo) => (
          <TimeframeCard key={prazo.title} {...prazo} />
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={10}>
        <ChecklistCard title="Podem ser devolvidas" tone="permitido" items={PODEM} />
        <ChecklistCard title="Não podem ser devolvidas" tone="proibido" items={NAO_PODEM} />
      </SimpleGrid>

      <Box mb={10}>
        <Heading as="h2" variant="destaque" fontSize="xl" mb={5}>Como solicitar</Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
          {PASSOS.map((passo) => (
            <StepCard key={passo.number} {...passo} />
          ))}
        </SimpleGrid>
      </Box>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={10} mb={10}>
        <Box>
          <Heading as="h2" variant="destaque" fontSize="xl" mb={3}>Quem paga o frete?</Heading>
          <Text color="origem.texto">
            Em caso de defeito, avaria ou peça diferente do anúncio, o frete de devolução é por
            conta do Origem. Em caso de arrependimento, o primeiro envio de devolução também é
            gratuito.
          </Text>
        </Box>
        <Box>
          <Heading as="h2" variant="destaque" fontSize="xl" mb={3}>Canal de atendimento</Heading>
          <Text color="origem.texto">
            WhatsApp (81) 90000-0000 e e-mail contato@origem.com, de segunda a sábado, das 9h às
            19h30.
          </Text>
        </Box>
      </Grid>

      <InfoBox icon={BiErrorAlt} title="Sua peça chegou danificada?" tone="aviso">
        Não descarte a embalagem. Tire fotos da peça, da caixa e da etiqueta e nos avise em até 48
        horas pelo pedido. Você escolhe entre uma nova peça (quando houver) ou o reembolso integral.
      </InfoBox>
    </PageContainer>
  )
}
