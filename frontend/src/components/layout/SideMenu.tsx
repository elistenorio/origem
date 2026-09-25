import NextLink from "next/link"
import { VStack, Flex, Link } from "@chakra-ui/react"
import type { IconType } from "react-icons"

export type SideMenuItem = { id: string; label: string; icon: IconType; href: string }

type SideMenuProps = { items: readonly SideMenuItem[]; ativo: string; rotulo: string }

// Menu lateral de ícones (painel do artesão e do admin).
export function SideMenu({ items, ativo, rotulo }: SideMenuProps) {
  return (
    <VStack as="nav" aria-label={rotulo} bg="origem.passoFundo" w={{ base: "64px", md: "80px" }} minH="calc(100vh - 64px)" py={8} gap={6} alignItems="center" flexShrink={0}>
      {items.map((item) => {
        const isActive = ativo === item.id
        return (
          <Link asChild key={item.id} aria-label={item.label} title={item.label} aria-current={isActive ? "page" : undefined}>
            <NextLink href={item.href}>
              <Flex w="48px" h="48px" bg={isActive ? "origem.laranja" : "origem.fundo"} color={isActive ? "white" : "origem.marrom"} borderRadius="full" alignItems="center" justifyContent="center" _hover={{ opacity: 0.8 }}>
                <item.icon size={24} />
              </Flex>
            </NextLink>
          </Link>
        )
      })}
    </VStack>
  )
}
