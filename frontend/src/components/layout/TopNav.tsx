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
    <Box as="nav" bg="origem.marrom" py="3" px="4">
      <HStack justify="center" gap={{ base: 4, md: 10 }} wrap="wrap">
        {links.map((item) => (
          <Link
            asChild
            key={item.href}
            color="origem.fundo"
            textTransform="uppercase"
            fontWeight="medium"
            _hover={{ textDecoration: "none", opacity: 0.8 }}
          >
            <NextLink href={item.href}>{item.label}</NextLink>
          </Link>
        ))}
      </HStack>
    </Box>
  )
}