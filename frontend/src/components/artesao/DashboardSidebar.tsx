import { BiStore, BiUser, BiDesktop, BiPackage, BiReceipt } from "react-icons/bi"
import { SideMenu } from "@/components/layout/SideMenu"

export type ItemMenuArtesao = "dashboard" | "perfil" | "catalogo" | "estoque" | "pedidos"

const items = [
  { id: "dashboard", label: "Início", icon: <BiStore size={24} />, href: "/artesao/dashboard" },
  { id: "perfil", label: "Meu perfil", icon: <BiUser size={24} />, href: "/artesao/perfil" },
  { id: "catalogo", label: "Meu catálogo", icon: <BiDesktop size={24} />, href: "/artesao/catalogo" },
  { id: "estoque", label: "Estoque", icon: <BiPackage size={24} />, href: "/artesao/estoque" },
  { id: "pedidos", label: "Pedidos", icon: <BiReceipt size={24} />, href: "/artesao/pedidos" },
] as const

export function DashboardSidebar({ activeItem = "dashboard" }: { activeItem?: ItemMenuArtesao }) {
  return <SideMenu items={items} ativo={activeItem} rotulo="Menu do artesão" />
}
