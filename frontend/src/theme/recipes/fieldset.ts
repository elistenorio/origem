import { defineSlotRecipe } from "@chakra-ui/react"
import { fieldsetAnatomy } from "@chakra-ui/react/anatomy"

export const fieldsetOrigem = defineSlotRecipe({
  slots: fieldsetAnatomy.keys(),
  base: {
    legend: {
      textTransform: "uppercase",
      fontWeight: "bold",
      color: "origem.texto",
    },
  },
})
