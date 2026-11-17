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
        root: { bg: "white", borderRightWidth: "1px", borderColor: "origem.linha", w: { base: "full", md: "260px" }, minH: { md: "calc(100vh - 64px)" }, py: { base: "3", md: "8" }, px: "4", gap: "2", flexDirection: { base: "row", md: "column" }, overflowX: { base: "auto", md: "visible" } },
        item: {
          gap: "3",
          px: "4",
          py: "3",
          minH: "52px",
          borderRadius: "xl",
          color: "origem.texto",
          fontWeight: "medium",
          fontSize: "md",
          whiteSpace: "nowrap",
          _hover: { bg: "origem.busca" },
          _currentPage: { bg: "origem.busca", color: "origem.laranja", fontWeight: "bold" },
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
          _currentPage: { bg: "origem.busca", color: "origem.laranja", fontWeight: "bold", _hover: { bg: "origem.busca" } },
        },
        sair: { gap: "3", px: "4", py: "3", color: "origem.perigo", fontWeight: "medium" },
      },
    },
  },
  defaultVariants: { variant: "icones" },
})
