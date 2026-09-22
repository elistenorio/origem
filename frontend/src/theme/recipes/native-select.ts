import { defineSlotRecipe } from "@chakra-ui/react"
import { nativeSelectAnatomy } from "@chakra-ui/react/anatomy"

export const nativeSelectOrigem = defineSlotRecipe({
  slots: nativeSelectAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        field: {
          bg: "origem.busca",
          borderWidth: "0",
          borderRadius: "lg",
          color: "origem.texto",
          minH: "50px",
        },
        indicator: { color: "origem.texto" }, // a setinha
      },
    },
  },
  defaultVariants: { variant: "origem" },
})