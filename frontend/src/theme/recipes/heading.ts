import { defineRecipe } from "@chakra-ui/react"

export const headingRecipe = defineRecipe({
  variants: {
    variant: {
      // título do produto: laranja, fonte condensada, sem negrito falso
      titulo: { color: "origem.texto", fontWeight: "800", letterSpacing: "-0.01em" },
      // títulos dos cards (login, pré-cadastro, modal): laranja em maiúsculas
      destaque: { color: "origem.texto", fontWeight: "800", letterSpacing: "-0.01em" },
      // títulos das etapas do cadastro: fonte de texto, negrito, escura
      secao: { fontFamily: "heading", fontWeight: "bold", color: "origem.texto" },
    },
  },
  defaultVariants: { variant: "titulo" },
})