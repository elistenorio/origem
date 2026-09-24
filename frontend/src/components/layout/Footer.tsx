import NextLink from "next/link"
import { Box, Image, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react"

type FooterLink = {
  label: string
  href: string
}

type FooterSection = {
  title: string
  items: FooterLink[]
}

type ContactItem = {
  label: string
  value?: string
}

const contactItems: ContactItem[] = [
  { label: "WhatsApp", value: "(81) 90000-0000" },
  { label: "Telefone", value: "(81) 0000-0000" },
  { label: "Email", value: "contato@origem.com" },
  { label: "Horário de Atendimento", value: "Segunda a Sábado\n09h00 às 19h30" },
]

const sections: FooterSection[] = [
  {
    title: "Navegação",
    items: [
      { label: "Home", href: "/" },
      { label: "Catálogo", href: "/catalogo" },
      { label: "Artesãos", href: "/artesaos" },
      { label: "Sobre nós", href: "/sobre" },
      { label: "Faça parte do Origem", href: "/cadastro" },
      { label: "Nossa Newsletter", href: "/newsletter" },
    ],
  },
  {
    title: "Ajuda",
    items: [
      { label: "Perguntas frequentes", href: "/ajuda/perguntas-frequentes" },
      { label: "Como comprar", href: "/ajuda/como-comprar" },
      { label: "Entregas e frete", href: "/ajuda/entregas-e-frete" },
      { label: "Trocas e devoluções", href: "/ajuda/trocas-e-devolucoes" },
      { label: "Formas de pagamento", href: "/ajuda/formas-de-pagamento" },
    ],
  },
  {
    title: "Institucional",
    items: [
      { label: "Termos de uso", href: "/institucional/termos-de-uso" },
      { label: "Política de privacidade", href: "/institucional/politica-de-privacidade" },
      { label: "Política de cookies", href: "/institucional/politica-de-cookies" },
    ],
  },
  {
    title: "Siga o Origem",
    items: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Pinterest", href: "https://pinterest.com" },
    ],
  },
]

export function Footer() {
  return (
    <Box as="footer" bg="origem.marrom" color="origem.fundo" px={{ base: 4, md: 8 }} py={{ base: 10, md: 14 }}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 6 }} gap={{ base: 8, md: 10 }} alignItems="start">
        <Box>
          <Image src="/logo-origem-footer.svg" alt="Origem" maxW={{ base: "260px", md: "300px" }} w="full" />
        </Box>

        <Box>
          <Text fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" mb="4">
            Entre em contato
          </Text>
          <Stack gap="3" fontSize="sm" lineHeight="1.35">
            {contactItems.map((item) => (
              <Box key={item.label}>
                <Text fontWeight="bold">{item.label}</Text>
                {item.value ? (
                  <Text whiteSpace="pre-line" color="origem.fundo">
                    {item.value}
                  </Text>
                ) : null}
              </Box>
            ))}
          </Stack>
        </Box>

        {sections.map((section) => (
          <Box key={section.title}>
            <Text fontWeight="700" textTransform="uppercase" letterSpacing="0.08em" mb="4">
              {section.title}
            </Text>
            <Stack gap="2" fontSize="sm" lineHeight="1.35">
              {section.items.map((item) => (
                <Link
                  asChild
                  key={item.label}
                  color="origem.fundo"
                  _hover={{ textDecoration: "none", opacity: 0.8 }}
                >
                  <NextLink href={item.href}>{item.label}</NextLink>
                </Link>
              ))}
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}