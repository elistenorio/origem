import { defineSlotRecipe } from "@chakra-ui/react"
import { switchAnatomy } from "@chakra-ui/react/anatomy"

export const switchOrigem = defineSlotRecipe({
  slots: switchAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        control: {
          bg: "origem.passoInativo",
          _checked: { bg: "origem.laranja" },
        },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})
