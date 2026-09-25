import { defineSlotRecipe } from "@chakra-ui/react"
import { tabsAnatomy } from "@chakra-ui/react/anatomy"

// Abas em formato de pill (como no print: "ABA" "ABA" lado a lado),
// não a aba sublinhada clássica.
export const tabsOrigem = defineSlotRecipe({
  slots: tabsAnatomy.keys(),
  variants: {
    variant: {
      origem: {
        list: {
          bg: "origem.passoFundo",
          borderRadius: "full",
          p: "1",
          gap: "1",
          w: "fit-content",
        },
        trigger: {
          borderRadius: "full",
          px: "5",
          py: "2",
          fontWeight: "bold",
          textTransform: "uppercase",
          fontSize: "sm",
          color: "origem.texto",
          _selected: {
            bg: "origem.laranja",
            color: "white",
          },
        },
        // é um pill, não uma barra sublinhada
        indicator: { display: "none" },
      },
    },
  },
  defaultVariants: { variant: "origem" },
})
