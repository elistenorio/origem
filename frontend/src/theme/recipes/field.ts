import { defineSlotRecipe } from "@chakra-ui/react"
import { fieldAnatomy } from "@chakra-ui/react/anatomy"

export const fieldOrigem = defineSlotRecipe({
  slots: fieldAnatomy.keys(),
  base: {
    label: {
      textTransform: "uppercase",
      fontWeight: "bold",
      color: "origem.texto",
    },
  },
})