import { defineSlotRecipe } from "@chakra-ui/react"
import { dialogAnatomy } from "@chakra-ui/react/anatomy"

// Pop-ups: fundo desfocado com véu laranja e caixa clara com cantos arredondados.
export const dialogOrigem = defineSlotRecipe({
  slots: dialogAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        backdrop: { bg: "origem.laranja/10", backdropFilter: "blur(6px)" },
        content: { bg: "origem.fundo", color: "origem.texto", borderRadius: "2xl", borderWidth: "1px", borderColor: "origem.marrom/50", boxShadow: "xl" },
        header: { px: "8", pt: "8", pb: "2" },
        title: { fontFamily: "heading", fontWeight: "normal", color: "origem.laranja", fontSize: "4xl", lineHeight: "1" },
        description: { color: "origem.textoSuave" },
        body: { px: "8", py: "4", display: "flex", flexDirection: "column", gap: "4" },
        footer: { px: "8", pb: "8", pt: "2", gap: "3" },
        closeTrigger: { color: "origem.texto" },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})
