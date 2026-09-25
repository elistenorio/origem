import { Box, Flex, HStack, Button, Heading, IconButton, Link } from "@chakra-ui/react"
import { BiMenu, BiUser, BiBasket } from "react-icons/bi"
import NextLink from "next/link"
import { SearchField } from "@/components/common/SearchField"

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
          <SearchField placeholder="O que você está procurando... (ex: vaso, prato, cerâmica)" />
        </Box>

        {/* Right: Actions */}
        <HStack gap={4}>
          <Button variant="outline" px={6}>
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
