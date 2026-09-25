"use client"

import { useState, type FormEvent } from "react"
import { Box, Button, Flex, Grid, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react"
import { BiCheckCircle, BiEnvelope } from "react-icons/bi"
import { PageBreadcrumb } from "@/components/common/PageBreadcrumb"
import { SectionCard } from "@/components/common/SectionCard"
import { FormField } from "@/components/common/FormField"
import { AppCheckbox } from "@/components/common/AppCheckbox"

const BENEFICIOS = [
  "Histórias e entrevistas com artesãos de todo Pernambuco",
  "Lançamentos e peças únicas em primeira mão",
  "Convites para feiras, oficinas e eventos",
  "Nada de spam: cancele quando quiser, com um clique",
]

export default function NewsletterPage() {
  const [inscrito, setInscrito] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault() // depois: chamar a API de newsletter
    setInscrito(true)
  }

  return (
    <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 8 }} py={8}>
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
          {inscrito ? (
            <Stack
              align="center"
              textAlign="center"
              gap={3}
              bg="origem.fundo"
              borderWidth="1px"
              borderColor="origem.sucesso"
              borderRadius="xl"
              p={8}
            >
              <Flex
                boxSize="56px"
                bg="origem.sucesso"
                color="white"
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
              >
                <BiCheckCircle size={28} />
              </Flex>
              <Heading as="h2" variant="destaque" fontSize="2xl">
                Inscrição confirmada!
              </Heading>
              <Text fontSize="sm" color="origem.texto">
                Enviamos um e-mail para ana.beatriz@email.com. Confirme o endereço para começar a
                receber a newsletter.
              </Text>
            </Stack>
          ) : (
            <SectionCard title="Assine gratuitamente">
              <Text fontSize="sm" color="origem.textoSuave" mt={-2}>
                Preencha seus dados para receber a próxima edição.
              </Text>

              <form onSubmit={handleSubmit}>
                <Stack gap={4}>
                  <FormField label="Nome" placeholder="Como podemos te chamar?" />
                  <FormField label="E-mail" type="email" placeholder="email@exemplo.com" />
                  <AppCheckbox>
                    Aceito receber e-mails e li a Política de Privacidade.
                  </AppCheckbox>
                  <Button variant="origem" w="full" type="submit">
                    <BiEnvelope /> Quero receber
                  </Button>
                  <Text fontSize="xs" color="origem.textoSuave">
                    Seus dados são usados apenas para o envio da newsletter, conforme a LGPD. Você
                    pode cancelar a inscrição a qualquer momento pelo link no fim de cada e-mail.
                  </Text>
                </Stack>
              </form>
            </SectionCard>
          )}
        </Stack>
      </Grid>
    </Box>
  )
}
