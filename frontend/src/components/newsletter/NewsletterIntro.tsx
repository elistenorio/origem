import { HStack, List, Stack, Text } from "@chakra-ui/react"
import { BiCheck } from "react-icons/bi"
import { Banner } from "@/components/common/Banner"


const BENEFICIOS = [
  "Histórias e entrevistas com artesãos de todo Pernambuco",
  "Lançamentos e peças únicas em primeira mão",
  "Convites para feiras, oficinas e eventos",
  "Nada de spam: cancele quando quiser, com um clique",
]

// Apresentação da newsletter e benefícios de assinar.
export function NewsletterIntro() {
  return (
    <Stack gap="6" flex="1">
      <Text fontSize="lg">
        Histórias de quem faz, direto no seu e-mail. A cada quinze dias, contamos a trajetória de um artesão, mostramos as técnicas por trás das peças e apresentamos os lançamentos da vitrine.
      </Text>
      <Banner as="div" bgImage="url('/images/bg-pre-register.png')" h={{ base: "200px", md: "280px" }} />
      <Text textStyle="rotulo" fontSize="md">O que você recebe</Text>
      <List.Root gap="3" variant="plain">
        {BENEFICIOS.map((b) => (
          <List.Item key={b}>
            <HStack gap="3" align="flex-start">
              <List.Indicator asChild color="origem.laranja"><BiCheck /></List.Indicator>
              <Text>{b}</Text>
            </HStack>
          </List.Item>
        ))}
      </List.Root>
    </Stack>
  )
}
