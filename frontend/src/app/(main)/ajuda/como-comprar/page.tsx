import NextLink from "next/link"
import { Box, Button, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react"
import { BiCart, BiCreditCard, BiInfoCircle, BiMapPin, BiPackage, BiSearch, BiUser } from "react-icons/bi"
import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { StepCard } from "@/components/ajuda/StepCard"
import { InfoBox } from "@/components/ajuda/InfoBox"

const PASSOS = [
  {
    icon: BiSearch,
    number: "01",
    title: "Encontre a peça",
    description: "Navegue pelo catálogo, use a busca e os filtros por categoria, técnica, material e preço.",
  },
  {
    icon: BiUser,
    number: "02",
    title: "Conheça o artesão",
    description: "Na página da peça, veja quem fez, de onde vem e a técnica usada. Cada peça tem história.",
  },
  {
    icon: BiCart,
    number: "03",
    title: "Adicione ao carrinho",
    description: "Confira medidas, fotos e disponibilidade. Peças únicas ficam reservadas por 30 minutos.",
  },
  {
    icon: BiMapPin,
    number: "04",
    title: "Informe a entrega",
    description: "Digite o seu CEP para ver as opções de frete e o prazo estimado de entrega.",
  },
  {
    icon: BiCreditCard,
    number: "05",
    title: "Escolha o pagamento",
    description: "Pague com cartão em até 6x sem juros, Pix ou boleto, em ambiente seguro.",
  },
  {
    icon: BiPackage,
    number: "06",
    title: "Acompanhe o pedido",
    description: "Em Meus pedidos você vê cada etapa e recebe o código de rastreio por e-mail.",
  },
]

export default function ComoComprarPage() {
  return (
    <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Ajuda" },
          { label: "Como comprar" },
        ]}
      />

      <Box mt={6} mb={8}>
        <Heading as="h1" variant="titulo" fontSize={{ base: "3xl", md: "5xl" }} mb={2}>
          Como comprar
        </Heading>
        <Text color="origem.texto">
          Comprar no Origem é simples. Veja o passo a passo, do catálogo até a sua casa.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={8}>
        {PASSOS.map((passo) => (
          <StepCard key={passo.number} {...passo} />
        ))}
      </SimpleGrid>

      <Box mb={10}>
        <InfoBox icon={BiInfoCircle} title="Dica" tone="neutro">
          Não precisa criar conta para comprar. Mas, com uma conta, você acompanha seus pedidos,
          salva endereços e segue seus artesãos favoritos.
        </InfoBox>
      </Box>

      <Stack direction={{ base: "column", sm: "row" }} justify="center" gap={4}>
        <Button asChild variant="origem">
          <NextLink href="/catalogo">→ Ir para o catálogo</NextLink>
        </Button>
        <Button asChild variant="outline">
          <NextLink href="/minha-conta">
            <BiPackage /> Ver pedidos
          </NextLink>
        </Button>
      </Stack>
    </Box>
  )
}
