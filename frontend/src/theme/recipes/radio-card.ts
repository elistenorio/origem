import { defineSlotRecipe } from "@chakra-ui/react"
import { radioCardAnatomy } from "@chakra-ui/react/anatomy"

// Opções selecionáveis em forma de card (frete, forma de pagamento, papel no cadastro).
export const radioCardOrigem = defineSlotRecipe({
  slots: radioCardAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        item: {
          bg: "origem.fundo",
          borderWidth: "1px",
          borderColor: "origem.marrom/50",
          borderRadius: "lg",
          color: "origem.texto",
          _checked: { borderColor: "origem.laranja", borderWidth: "2px" },
        },
        itemIndicator: { color: "origem.laranja", borderColor: "origem.texto", _checked: { bg: "origem.laranja", borderColor: "origem.laranja" } },
        itemText: { fontWeight: "bold", fontSize: "sm" },
        itemDescription: { color: "origem.textoSuave", fontSize: "sm" },
        label: { fontWeight: "bold", textTransform: "uppercase", color: "origem.texto" },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})
