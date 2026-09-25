import { defineRecipe } from "@chakra-ui/react"

export const linkRecipe = defineRecipe({
  variants: {
    variant: {
      // link de destaque (laranja, negrito)
      origem: { color: "origem.laranja", fontWeight: "bold", _hover: { textDecoration: "none", opacity: 0.8 } },
      // link discreto (breadcrumb, rodapé de lista)
      suave: { color: "origem.textoSuave", _hover: { color: "origem.texto", textDecoration: "none" } },
    },
  },
})
