import { defineSlotRecipe } from "@chakra-ui/react"
import { ratingGroupAnatomy } from "@chakra-ui/react/anatomy"

// Estrelas de avaliação.
export const ratingGroupOrigem = defineSlotRecipe({
  slots: ratingGroupAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        item: { color: "origem.marrom/50", _highlighted: { color: "origem.laranja" }, _checked: { color: "origem.laranja" } },
        label: { fontWeight: "bold", textTransform: "uppercase", color: "origem.texto" },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})
