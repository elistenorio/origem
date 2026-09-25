import { Box, Flex, HStack, Input, Button, Heading, IconButton, Link } from "@chakra-ui/react"
import { BiMenu, BiSearch, BiUser, BiBasket } from "react-icons/bi"
import NextLink from "next/link"

export function Header() {
  return (
    <Box bg="transparent" py={4} px={{ base: 4, md: 10 }}>
      <Flex gap={8} align="center" justify="space-between" flexWrap={{ base: "wrap", md: "nowrap" }}>
        {/* Left: Logo & Menu */}
        <HStack gap={4}>
          <IconButton aria-label="Menu" variant="ghost" color="origem.laranja" _hover={{ bg: "transparent", opacity: 0.8 }}>
            <BiMenu size={28} />
          </IconButton>
          <Link asChild _hover={{ textDecoration: "none" }}>
            <NextLink href="/">
              <Heading variant="titulo" textTransform="uppercase" letterSpacing="widest" fontSize="3xl" color="origem.laranja" _hover={{ opacity: 0.8 }}>
                Origem
              </Heading>
            </NextLink>
          </Link>
        </HStack>

        {/* Center: Search */}
        <Box flex="1" maxW="600px">
          <HStack bg="origem.busca" borderRadius="md" px={4} py={2} w="full">
            <Box color="origem.textoSuave">
              <BiSearch />
            </Box>
            <Input variant="unstyled" placeholder="O que você está procurando... (ex: vaso, prato, cerâmica)" />
          </HStack>
        </Box>

        {/* Right: Actions */}
        <HStack gap={4}>
          <Button
            bg="transparent"
            borderWidth="1px"
            borderColor="origem.laranja"
            color="origem.laranja"
            borderRadius="md"
            px={6}
            _hover={{ bg: "origem.laranja", color: "white" }}
          >
            <BiUser /> Acesso / Minha Conta
          </Button>
          <Button variant="origem" px={6}>
            <BiBasket /> Meu Carrinho
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}
