import { defineSlotRecipe } from "@chakra-ui/react"
import { tableAnatomy } from "@chakra-ui/react/anatomy"

// Tabelas dos painéis (estoque, gestão, pedidos).
export const tableOrigem = defineSlotRecipe({
  slots: tableAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        root: { bg: "transparent", color: "origem.texto" },
        header: { bg: "transparent" },
        columnHeader: { bg: "transparent", color: "origem.texto", fontWeight: "bold", textTransform: "uppercase", fontSize: "sm", borderBottomWidth: "1px", borderColor: "origem.marrom/50", py: "3" },
        row: { bg: "transparent", _hover: { bg: "origem.fundo/60" } },
        cell: { borderBottomWidth: "1px", borderColor: "origem.marrom/30", py: "3" },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})
