"use client"

import NextLink from "next/link"
import { chakra, Link, useSlotRecipe } from "@chakra-ui/react"

// icon vai como elemento (<BiHome />): funções não podem ir de Server para Client Component
export type SideMenuItem = { id: string; label: string; icon: React.ReactNode; href: string }

type SideMenuProps = { items: readonly SideMenuItem[]; ativo: string; rotulo: string }

// Menu lateral de ícones (painel do artesão e do admin). Estilo na recipe "sideMenu".
export function SideMenu({ items, ativo, rotulo }: SideMenuProps) {
  const styles = useSlotRecipe({ key: "sideMenu" })({ variant: "icones" })
  return (
    <chakra.nav aria-label={rotulo} css={styles.root}>
      {items.map((item) => (
        <Link asChild key={item.id} css={styles.item} aria-label={item.label} title={item.label} aria-current={ativo === item.id ? "page" : undefined}>
          <NextLink href={item.href}>
            {item.icon}
          </NextLink>
        </Link>
      ))}
    </chakra.nav>
  )
}
