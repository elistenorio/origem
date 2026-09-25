import { defineSlotRecipe } from "@chakra-ui/react"

// Menus laterais: "icones" (painel do artesão e do admin) e "lista" (minha conta).
// O item ativo é marcado com aria-current="page" no link (condição _currentPage).
export const sideMenuRecipe = defineSlotRecipe({
  className: "side-menu",
  slots: ["root", "item", "sair"],
  base: {
    root: { display: "flex", flexDirection: "column", flexShrink: 0 },
    item: { display: "flex", alignItems: "center", textDecoration: "none", _hover: { textDecoration: "none" } },
    sair: { display: "flex", alignItems: "center", textDecoration: "none", _hover: { textDecoration: "none" } },
  },
  variants: {
    variant: {
      icones: {
        root: { bg: "origem.passoFundo", w: { base: "64px", md: "80px" }, minH: "calc(100vh - 64px)", py: "8", gap: "6", alignItems: "center" },
        item: {
          w: "48px",
          h: "48px",
          borderRadius: "full",
          justifyContent: "center",
          bg: "origem.fundo",
          color: "origem.marrom",
          _hover: { opacity: 0.8 },
          _currentPage: { bg: "origem.laranja", color: "white" },
        },
      },
      lista: {
        root: { gap: "2", w: { base: "full", lg: "220px" } },
        item: {
          gap: "3",
          px: "4",
          py: "3",
          borderRadius: "lg",
          color: "origem.texto",
          fontWeight: "medium",
          _hover: { bg: "origem.busca" },
          _currentPage: { bg: "origem.laranja", color: "white", _hover: { bg: "origem.laranja" } },
        },
        sair: { gap: "3", px: "4", py: "3", color: "origem.perigo", fontWeight: "medium" },
      },
    },
  },
  defaultVariants: { variant: "icones" },
})
