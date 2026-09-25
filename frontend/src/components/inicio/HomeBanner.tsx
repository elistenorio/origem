import NextLink from "next/link"
import { Button, Heading, Stack, Text } from "@chakra-ui/react"
import { BiRightArrowAlt } from "react-icons/bi"
import { Banner } from "@/components/common/Banner"


// Destaque do topo da vitrine (conteúdo da newsletter).
export function HomeBanner() {
  return (
    <Banner bgImage="url('/images/bg-login.png')" px={{ base: "6", md: "12" }} py={{ base: "10", md: "16" }}>
      <Stack gap="4" maxW="2xl">
        <Text textStyle="rotulo" color="origem.fundo">Nossa newsletter</Text>
        <Heading as="h1" variant="titulo" color="origem.fundo" fontSize={{ base: "4xl", md: "6xl" }} lineHeight="1">
          As Bordadeiras de Passira
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }}>
          Entre linhas e histórias: as bordadeiras que mantêm viva a tradição de Passira.
        </Text>
        <Button asChild variant="origem" alignSelf="flex-start">
          <NextLink href="/newsletter">
            Leia na newsletter <BiRightArrowAlt />
          </NextLink>
        </Button>
      </Stack>
    </Banner>
  )
}
