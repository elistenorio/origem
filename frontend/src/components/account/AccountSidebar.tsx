import NextLink from "next/link"
import { Box, Link, VStack } from "@chakra-ui/react"
import { BiCreditCard, BiLockAlt, BiMap, BiLogOut, BiPackage, BiSliderAlt, BiUser } from "react-icons/bi"

type AccountItem =
  | "dados-pessoais"
  | "endereco"
  | "pedidos"
  | "pagamento"
  | "preferencias"
  | "privacidade"

interface AccountSidebarProps {
  activeItem?: AccountItem
}

const items: { id: AccountItem; label: string; icon: typeof BiUser; href: string }[] = [
  { id: "dados-pessoais", label: "Dados pessoais", icon: BiUser, href: "/minha-conta" },
  { id: "endereco", label: "Endereço", icon: BiMap, href: "/minha-conta/endereco" },
  { id: "pedidos", label: "Meus pedidos", icon: BiPackage, href: "/minha-conta/pedidos" },
  { id: "pagamento", label: "Pagamento", icon: BiCreditCard, href: "/minha-conta/pagamento" },
  { id: "preferencias", label: "Preferências", icon: BiSliderAlt, href: "/minha-conta/preferencias" },
  { id: "privacidade", label: "Privacidade", icon: BiLockAlt, href: "/minha-conta/privacidade" },
]

export function AccountSidebar({ activeItem = "dados-pessoais" }: AccountSidebarProps) {
  return (
    <VStack as="nav" align="stretch" gap={2} w={{ base: "full", lg: "220px" }} flexShrink={0}>
      {items.map((item) => {
        const isActive = activeItem === item.id
        return (
          <Link
            asChild
            key={item.id}
            _hover={{ textDecoration: "none" }}
          >
            <NextLink href={item.href}>
              <Box
                display="flex"
                alignItems="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="lg"
                bg={isActive ? "origem.laranja" : "transparent"}
                color={isActive ? "white" : "origem.texto"}
                fontWeight="medium"
                _hover={{ bg: isActive ? "origem.laranja" : "origem.busca" }}
              >
                <item.icon size={18} />
                {item.label}
              </Box>
            </NextLink>
          </Link>
        )
      })}

      <Link asChild _hover={{ textDecoration: "none" }}>
        <NextLink href="/">
          <Box display="flex" alignItems="center" gap={3} px={4} py={3} color="origem.perigo" fontWeight="medium">
            <BiLogOut size={18} />
            Sair
          </Box>
        </NextLink>
      </Link>
    </VStack>
  )
}
