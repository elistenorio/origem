import { BiStore, BiUser, BiDesktop, BiPackage } from "react-icons/bi"
import { SideMenu } from "@/components/layout/SideMenu"

export type ItemMenuArtesao = "dashboard" | "perfil" | "catalogo" | "estoque"

const items = [
  { id: "dashboard", label: "Início", icon: BiStore, href: "/artesao/dashboard" },
  { id: "perfil", label: "Meu perfil", icon: BiUser, href: "/artesao/perfil" },
  { id: "catalogo", label: "Meu catálogo", icon: BiDesktop, href: "/artesao/catalogo" },
  { id: "estoque", label: "Estoque", icon: BiPackage, href: "/artesao/estoque" },
] as const

export function DashboardSidebar({ activeItem = "dashboard" }: { activeItem?: ItemMenuArtesao }) {
  return <SideMenu items={items} ativo={activeItem} rotulo="Menu do artesão" />
}
