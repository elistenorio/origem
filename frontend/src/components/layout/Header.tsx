import NextLink from "next/link"
import { Box, Button, Heading, HStack, Input } from "@chakra-ui/react"
import { FiMenu, FiSearch, FiShoppingCart } from "react-icons/fi"

export function Header() {
  return (
    <Box
      as="header"
      bg="origem.fundo"
      borderBottomWidth="1px"
      borderColor="origem.marrom/15"
      position="sticky"
      top="0"
      zIndex="20"
    >
      <HStack
        gap={{ base: 3, md: 4 }}
        px={{ base: 4, md: 8 }}
        py={{ base: 4, md: 5 }}
        align="center"
        wrap="wrap"
      >
        <Button aria-label="Abrir menu" variant="tracejado" px="0" minW="50px" w="50px">
          <Box as="span" display="inline-flex" color="origem.texto">
            <FiMenu size={20} />
          </Box>
        </Button>

        <Heading asChild size="lg" letterSpacing="0.08em" flexShrink={0}>
          <NextLink href="/">ORIGEM</NextLink>
        </Heading>

        <Box flex="1" minW={{ base: "full", md: "360px" }} position="relative">
          <Box
            position="absolute"
            left="4"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
            color="origem.textoSuave"
            display="inline-flex"
          >
            <FiSearch size={16} />
          </Box>
          <Input aria-label="Buscar" placeholder="Buscar" ps="11" />
        </Box>

        <Button asChild variant="tracejado" whiteSpace="nowrap">
          <NextLink href="/login">Entrar / Criar Conta</NextLink>
        </Button>

        <Button asChild whiteSpace="nowrap">
          <NextLink href="/carrinho">
            <HStack gap="2">
              <Box as="span" display="inline-flex" color="origem.texto">
                <FiShoppingCart size={16} />
              </Box>
              <Box as="span">Meu Carrinho</Box>
            </HStack>
          </NextLink>
        </Button>
      </HStack>
    </Box>
  )
}