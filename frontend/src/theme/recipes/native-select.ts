import { defineSlotRecipe } from "@chakra-ui/react"
import { nativeSelectAnatomy } from "@chakra-ui/react/anatomy"
import { campoOrigem } from "./campos"

export const nativeSelectOrigem = defineSlotRecipe({
  slots: nativeSelectAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        field: { ...campoOrigem },
        indicator: { color: "origem.texto" }, // a setinha
      },
    },
  },
  defaultVariants: { variant: "origem" },
})