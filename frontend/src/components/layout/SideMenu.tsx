"use client"

import NextLink from "next/link"
import { chakra, Link, useSlotRecipe } from "@chakra-ui/react"

// icon vai como elemento (<BiHome />): funções não podem ir de Server para Client Component
export type SideMenuItem = { id: string; label: string; icon: React.ReactNode; href: string }

type SideMenuProps = { items: readonly SideMenuItem[]; ativo: string; rotulo: string }

// Menu lateral do painel do artesão e do admin: ícone + nome escrito, para ninguém
// precisar adivinhar o que cada ícone faz. Estilo na recipe "sideMenu".
export function SideMenu({ items, ativo, rotulo }: SideMenuProps) {
  const styles = useSlotRecipe({ key: "sideMenu" })({ variant: "icones" })
  return (
    <chakra.nav aria-label={rotulo} css={styles.root}>
      {items.map((item) => (
        <Link asChild key={item.id} css={styles.item} aria-current={ativo === item.id ? "page" : undefined}>
          <NextLink href={item.href}>
            {item.icon}
            {item.label}
          </NextLink>
        </Link>
      ))}
    </chakra.nav>
  )
}
