import { defineRecipe } from "@chakra-ui/react"

export const headingRecipe = defineRecipe({
  variants: {
    variant: {
      // título do produto: laranja, fonte condensada, sem negrito falso
      titulo: { color: "origem.laranja", fontWeight: "normal" },
      // títulos dos cards (login, pré-cadastro, modal): laranja em maiúsculas
      destaque: { color: "origem.laranja", fontWeight: "normal", textTransform: "uppercase" },
      // títulos das etapas do cadastro: fonte de texto, negrito, escura
      secao: { fontFamily: "body", fontWeight: "bold", textTransform: "uppercase", color: "origem.texto" },
    },
  },
  defaultVariants: { variant: "titulo" },
})