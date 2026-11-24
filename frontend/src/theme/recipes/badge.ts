import { defineRecipe, defineStyle } from "@chakra-ui/react"

// Formato comum a todo selo: maiúsculas, negrito, bem arredondado.
const seloBase = defineStyle({
  fontWeight: "bold",
  fontSize: "md",
  borderRadius: "full",
  px: "3",
  py: "1",
})

export const badgeRecipe = defineRecipe({
  variants: {
    variant: {
      origem: { ...seloBase, bg: "origem.busca", color: "origem.laranja" },
      // Tons de status (pedido, estoque, cadastro). Ver StatusBadge para o
      // mapa "nome do status -> tom" já pronto.
      sucesso: { ...seloBase, bg: "origem.sucesso", color: "white" },
      aviso: { ...seloBase, bg: "origem.aviso", color: "origem.texto" },
      perigo: { ...seloBase, bg: "origem.perigo", color: "white" },
      info: { ...seloBase, bg: "origem.info", color: "white" },
      neutro: { ...seloBase, bg: "origem.passoInativo", color: "origem.texto" },
    },
  },
  defaultVariants: { variant: "origem" },
})
