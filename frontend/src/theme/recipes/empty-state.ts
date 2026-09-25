import { defineSlotRecipe } from "@chakra-ui/react"
import { emptyStateAnatomy } from "@chakra-ui/react/anatomy"

export const emptyStateOrigem = defineSlotRecipe({
  slots: emptyStateAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        root: { bg: "origem.passoFundo", borderRadius: "2xl", py: "12", px: "6" },
        indicator: { color: "origem.laranja", fontSize: "4xl" },
        title: { color: "origem.texto", fontWeight: "bold" },
        description: { color: "origem.textoSuave" },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})
