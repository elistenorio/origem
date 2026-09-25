import { Box, Flex } from "@chakra-ui/react"
import { BiHome, BiSliderAlt, BiBarChartAlt2, BiPulse, BiBadgeCheck, BiGridAlt } from "react-icons/bi"
import { SideMenu } from "@/components/layout/SideMenu"

export type ItemMenuAdmin = "inicio" | "gestao" | "indicadores" | "acompanhamento" | "curadoria" | "visao-geral"

const items = [
  { id: "inicio", label: "Início", icon: <BiHome size={24} />, href: "/admin" },
  { id: "gestao", label: "Gestão da plataforma", icon: <BiSliderAlt size={24} />, href: "/admin/gestao" },
  { id: "curadoria", label: "Curadoria", icon: <BiBadgeCheck size={24} />, href: "/admin/curadoria" },
  { id: "acompanhamento", label: "Acompanhamento", icon: <BiPulse size={24} />, href: "/admin/acompanhamento" },
  { id: "indicadores", label: "Indicadores", icon: <BiBarChartAlt2 size={24} />, href: "/admin/indicadores" },
  { id: "visao-geral", label: "Visão geral", icon: <BiGridAlt size={24} />, href: "/admin/visao-geral" },
] as const

// Moldura das telas do administrador: menu lateral + conteúdo.
export function AdminShell({ ativo, children }: { ativo: ItemMenuAdmin; children: React.ReactNode }) {
  return (
    <Flex>
      <SideMenu items={items} ativo={ativo} rotulo="Menu do administrador" />
      <Box flex="1" minW="0" px={{ base: 4, md: 10 }} py={{ base: 6, md: 8 }}>
        {children}
      </Box>
    </Flex>
  )
}
