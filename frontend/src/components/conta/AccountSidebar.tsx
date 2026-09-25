"use client"

import NextLink from "next/link"
import { chakra, Link, useSlotRecipe } from "@chakra-ui/react"
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

// Menu lateral da Minha Conta. Estilo na recipe "sideMenu" (variante "lista").
export function AccountSidebar({ activeItem = "dados-pessoais" }: AccountSidebarProps) {
  const styles = useSlotRecipe({ key: "sideMenu" })({ variant: "lista" })
  return (
    <chakra.nav aria-label="Menu da minha conta" css={styles.root}>
      {items.map((item) => (
        <Link asChild key={item.id} css={styles.item} aria-current={activeItem === item.id ? "page" : undefined}>
          <NextLink href={item.href}>
            <item.icon size={18} />
            {item.label}
          </NextLink>
        </Link>
      ))}

      <Link asChild css={styles.sair}>
        <NextLink href="/">
          <BiLogOut size={18} />
          Sair
        </NextLink>
      </Link>
    </chakra.nav>
  )
}
