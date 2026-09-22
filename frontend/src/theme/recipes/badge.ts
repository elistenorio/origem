import { defineRecipe } from "@chakra-ui/react"

export const badgeRecipe = defineRecipe({
  variants: {
    variant: {
      origem: {
        bg: "origem.laranja",
        color: "white",
        textTransform: "uppercase",
        fontWeight: "bold",
        letterSpacing: "wider",
        borderRadius: "full",
        px: "3",
      },
    },
  },
  defaultVariants: { variant: "origem" },
})