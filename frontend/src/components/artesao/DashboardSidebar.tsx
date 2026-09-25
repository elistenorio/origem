import { VStack, Flex, Link } from "@chakra-ui/react"
import { BiStore, BiUser, BiDesktop, BiBarChartSquare } from "react-icons/bi"
import NextLink from "next/link"

interface DashboardSidebarProps {
  activeItem?: 'dashboard' | 'perfil' | 'curso' | 'indicadores'
}

export function DashboardSidebar({ activeItem = 'dashboard' }: DashboardSidebarProps) {
  const items = [
    { id: 'dashboard', icon: BiStore, href: '/artesao/dashboard' },
    { id: 'perfil', icon: BiUser, href: '/artesao/perfil' },
    { id: 'curso', icon: BiDesktop, href: '/artesao/cursos' }, // Example paths
    { id: 'indicadores', icon: BiBarChartSquare, href: '/artesao/indicadores' },
  ]

  return (
    <VStack
      bg="origem.passoFundo"
      w="80px"
      minH="calc(100vh - 64px)"
      py={8}
      gap={6}
      alignItems="center"
    >
      {items.map((item) => {
        const isActive = activeItem === item.id
        return (
          <Link asChild key={item.id}>
            <NextLink href={item.href}>
              <Flex
                w="48px"
                h="48px"
                bg={isActive ? "origem.laranja" : "origem.fundo"}
                color={isActive ? "white" : "origem.marrom"}
                borderRadius="full"
                alignItems="center"
                justifyContent="center"
                _hover={{ opacity: 0.8 }}
              >
                <item.icon size={24} />
              </Flex>
            </NextLink>
          </Link>
        )
      })}
    </VStack>
  )
}
