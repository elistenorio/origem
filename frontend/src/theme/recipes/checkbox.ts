import { defineSlotRecipe } from "@chakra-ui/react"
import { checkboxAnatomy } from "@chakra-ui/react/anatomy"

export const checkboxOrigem = defineSlotRecipe({
  slots: checkboxAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        control: {
          borderColor: "origem.texto",
          borderRadius: "md",
          _checked: { bg: "origem.laranja", borderColor: "origem.laranja" },
        },
        label: { color: "origem.texto" },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})