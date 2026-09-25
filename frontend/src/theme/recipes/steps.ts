import { defineSlotRecipe } from "@chakra-ui/react"
import { stepsAnatomy } from "@chakra-ui/react/anatomy"

// Indicador de etapas (checkout).
export const stepsOrigem = defineSlotRecipe({
  slots: stepsAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        indicator: {
          bg: "origem.passoFundo",
          color: "origem.textoSuave",
          borderWidth: "0",
          fontWeight: "bold",
          _complete: { bg: "origem.laranja", color: "white" },
          _current: { bg: "origem.laranja", color: "white" },
        },
        title: { color: "origem.textoSuave", fontWeight: "bold", fontSize: "sm", _complete: { color: "origem.texto" }, _current: { color: "origem.texto" } },
        separator: { bg: "origem.laranja/30", _complete: { bg: "origem.laranja" } },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})
