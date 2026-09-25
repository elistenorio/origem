import NextLink from "next/link"
import { Badge, HStack, Link } from "@chakra-ui/react"
import { CATEGORIAS } from "@/constants/categorias"

// Atalhos de categoria (levam ao catálogo já filtrado).
export function CategoryChips({ ativa }: { ativa?: string }) {
  return (
    <HStack as="nav" aria-label="Categorias" gap="2" wrap="wrap" justify="center" py="4" borderYWidth="1px" borderColor="origem.laranja/30">
      {CATEGORIAS.map((c) => (
        <Link key={c.value} asChild _hover={{ textDecoration: "none", opacity: 0.8 }}>
          <NextLink href={`/catalogo?categoria=${c.value}`}>
            <Badge variant={c.value === ativa ? "origem" : "neutro"} textTransform="none" letterSpacing="normal" px="3" py="1">
              {c.label}
            </Badge>
          </NextLink>
        </Link>
      ))}
    </HStack>
  )
}
