import NextLink from "next/link"
import { Box, HStack, Link } from "@chakra-ui/react"

const links = [
  { label: "Home", href: "/" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Artesãos", href: "/artesaos" },
  { label: "Sobre nós", href: "/sobre" },
  { label: "Nossa Newsletter", href: "/newsletter" },
  { label: "Minha Conta", href: "/minha-conta" },
]

export function TopNav() {
  return (
    <Box as="nav" bg="white" borderBottomWidth="1px" borderColor="origem.linha" py="3" px="4">
      <HStack justify="center" gap={{ base: 4, md: 10 }} wrap="wrap">
        {links.map((item) => (
          <Link
            asChild
            key={item.href}
            color="origem.texto"
            fontWeight="medium"
            py="1"
            _hover={{ color: "origem.laranja", textDecoration: "underline", textUnderlineOffset: "4px" }}
          >
            <NextLink href={item.href}>{item.label}</NextLink>
          </Link>
        ))}
      </HStack>
    </Box>
  )
}