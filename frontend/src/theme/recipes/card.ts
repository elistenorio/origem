import { defineSlotRecipe } from "@chakra-ui/react"
import { cardAnatomy } from "@chakra-ui/react/anatomy"

// Painéis e cards das telas (resumo, formulários, listas).
export const cardOrigem = defineSlotRecipe({
  slots: cardAnatomy.keys(),
  variants: {
    variant: {
      // painel bege com borda suave (padrão das telas)
      origem: {
        root: { bg: "origem.passoFundo", borderWidth: "1px", borderColor: "origem.marrom/50", borderRadius: "2xl", color: "origem.texto" },
        header: { px: "6", pt: "6", pb: "0", gap: "1" },
        title: { fontFamily: "body", fontWeight: "bold", textTransform: "uppercase", fontSize: "md", color: "origem.texto" },
        description: { color: "origem.textoSuave", fontSize: "sm" },
        body: { px: "6", py: "6", gap: "4" },
        footer: { px: "6", pb: "6", pt: "0", gap: "3" },
      },
      // item claro dentro de um painel (notificação, alerta, pedido recente)
      item: {
        root: { bg: "origem.fundo", borderRadius: "lg", color: "origem.texto" },
        body: { px: "4", py: "3", gap: "1" },
        title: { fontFamily: "body", fontWeight: "bold", fontSize: "sm" },
        description: { color: "origem.textoSuave", fontSize: "sm" },
      },
      // card de vitrine (produto, artesão): fundo claro, borda laranja
      vitrine: {
        root: { bg: "origem.fundo", borderWidth: "1px", borderColor: "origem.laranja", borderRadius: "2xl", overflow: "hidden", color: "origem.texto", boxShadow: "xs" },
        body: { p: "4", gap: "1" },
        footer: { px: "4", pb: "4", pt: "0" },
      },
      // opção selecionável / destaque (item da fila da curadoria, aviso)
      destaque: {
        root: { bg: "origem.fundo", borderWidth: "2px", borderColor: "origem.laranja", borderRadius: "2xl", color: "origem.texto" },
        body: { px: "5", py: "4", gap: "2" },
        title: { fontFamily: "body", fontWeight: "bold", fontSize: "sm" },
        description: { color: "origem.textoSuave", fontSize: "sm" },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})
