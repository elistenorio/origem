import { Box, Grid, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react"
import { BiCheckCircle } from "react-icons/bi"
import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup"

const BENEFICIOS = [
  "Histórias e entrevistas com artesãos de todo Pernambuco",
  "Lançamentos e peças únicas em primeira mão",
  "Convites para feiras, oficinas e eventos",
  "Nada de spam: cancele quando quiser, com um clique",
]

export default function NewsletterPage() {
  return (
    <Box maxW="7xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
      <PageBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Nossa Newsletter" }]} />

      <Grid templateColumns={{ base: "1fr", lg: "1.4fr 1fr" }} gap={10} mt={6}>
        {/* Coluna da esquerda: sobre a newsletter */}
        <Stack gap={6}>
          <Box>
            <Heading as="h1" variant="titulo" fontSize={{ base: "4xl", md: "5xl" }} mb={4}>
              Nossa Newsletter
            </Heading>
            <Text color="origem.texto" fontSize="lg" lineHeight="1.6">
              Histórias de quem faz, direto no seu e-mail. A cada quinze dias, contamos a trajetória
              de um artesão, mostramos as técnicas por trás das peças e apresentamos os lançamentos
              da vitrine.
            </Text>
          </Box>

          <Image
            src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=900&auto=format&fit=crop"
            alt="Peça artesanal em tecido"
            w="full"
            h={{ base: "260px", md: "360px" }}
            objectFit="cover"
            borderRadius="2xl"
          />

          <Box>
            <Heading as="h2" variant="secao" fontSize="md" mb={4}>
              O que você recebe
            </Heading>
            <Stack gap={3}>
              {BENEFICIOS.map((beneficio) => (
                <HStack key={beneficio} align="flex-start" gap={3}>
                  <Box color="origem.sucesso" flexShrink={0} mt="1px">
                    <BiCheckCircle size={20} />
                  </Box>
                  <Text color="origem.texto">{beneficio}</Text>
                </HStack>
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Coluna da direita: formulário, ou a confirmação depois de enviar */}
        <Stack gap={6} align="stretch">
          <NewsletterSignup />
        </Stack>
      </Grid>
    </Box>
  )
}
