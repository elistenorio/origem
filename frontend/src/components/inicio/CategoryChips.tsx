import NextLink from "next/link"
import { Badge, HStack, Link } from "@chakra-ui/react"
import { CATEGORIAS } from "@/constants/categorias"

// Atalhos de categoria (levam ao catálogo já filtrado).
export function CategoryChips({ ativa }: { ativa?: string }) {
  return (
    <HStack as="nav" aria-label="Categorias" gap="3" wrap="wrap" justify="center" py="6" borderYWidth="1px" borderColor="origem.linha">
      {CATEGORIAS.map((c) => (
        <Link
          key={c.value}
          asChild
          borderRadius="full"
          _hover={{ textDecoration: "none" }}
          _focusVisible={{ outline: "3px solid", outlineColor: "origem.texto", outlineOffset: "2px" }}
          css={{ "&:hover > span": { bg: "origem.laranja", color: "white" } }}
        >
          <NextLink href={`/catalogo?categoria=${c.value}`}>
            <Badge
              variant={c.value === ativa ? "origem" : "neutro"}
              textTransform="none"
              letterSpacing="normal"
              fontSize="lg"
              fontWeight="bold"
              px="5"
              minH="48px"
              borderRadius="full"
              transition="background 0.15s, color 0.15s"
            >
              {c.label}
            </Badge>
          </NextLink>
        </Link>
      ))}
    </HStack>
  )
}
