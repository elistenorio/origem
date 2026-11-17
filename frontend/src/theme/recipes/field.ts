import { defineSlotRecipe } from "@chakra-ui/react"
import { fieldAnatomy } from "@chakra-ui/react/anatomy"

export const fieldOrigem = defineSlotRecipe({
  slots: fieldAnatomy.keys(),
  base: {
    label: {
      fontWeight: "bold",
      fontSize: "md",
      color: "origem.texto",
    },
    // dica de preenchimento embaixo do campo
    helperText: { fontSize: "md", color: "origem.textoSuave", lineHeight: "1.4" },
    errorText: { fontSize: "md", fontWeight: "medium" },
  },
})