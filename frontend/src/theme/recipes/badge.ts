import { defineRecipe, defineStyle } from "@chakra-ui/react"

// Formato comum a todo selo: maiúsculas, negrito, bem arredondado.
const seloBase = defineStyle({
  textTransform: "uppercase",
  fontWeight: "bold",
  letterSpacing: "wider",
  borderRadius: "full",
  px: "3",
})

export const badgeRecipe = defineRecipe({
  variants: {
    variant: {
      origem: { ...seloBase, bg: "origem.laranja", color: "white" },
      // Tons de status (pedido, estoque, cadastro). Ver StatusBadge para o
      // mapa "nome do status -> tom" já pronto.
      sucesso: { ...seloBase, bg: "origem.sucesso", color: "white" },
      aviso: { ...seloBase, bg: "origem.aviso", color: "origem.texto" },
      perigo: { ...seloBase, bg: "origem.perigo", color: "white" },
      info: { ...seloBase, bg: "origem.info", color: "white" },
      neutro: { ...seloBase, bg: "origem.marrom", color: "white" },
    },
  },
  defaultVariants: { variant: "origem" },
})
