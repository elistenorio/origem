import { defineSlotRecipe } from "@chakra-ui/react"
import { radioGroupAnatomy } from "@chakra-ui/react/anatomy"

// Lista de opções exclusivas (ex.: motivo do cancelamento).
export const radioGroupOrigem = defineSlotRecipe({
  slots: radioGroupAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        itemControl: { borderColor: "origem.texto", _checked: { bg: "origem.laranja", borderColor: "origem.laranja" } },
        itemText: { color: "origem.texto" },
        label: { fontWeight: "bold", textTransform: "uppercase", color: "origem.texto" },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})
