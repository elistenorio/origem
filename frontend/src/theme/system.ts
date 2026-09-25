import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import { recipes, slotRecipes } from "./recipes"

const config = defineConfig({
  globalCss: {
    body: { bg: "origem.fundo", color: "origem.texto" },
  },
  theme: {
    tokens: {
      colors: {
        origem: {
          laranja: { value: "#CF804F" },
          marrom: { value: "#A68B78" },
          fundo: { value: "#EDEEE8" },
          texto: { value: "#432A25" },
          textoSuave: { value: "#958177" },
          busca: { value: "#E7D8CA" },
          categoria: { value: "#DDB79B" },
          passoFundo: { value: "#DBD6CE" },
          passoInativo: { value: "#D8BCA9" },
          // Cores de status (selos de pedido/estoque). Primeira leva, tons combinando
          // com a paleta terrosa do projeto — ajustar se o design tiver valores exatos.
          sucesso: { value: "#6B8F5A" },
          aviso: { value: "#D6A249" },
          perigo: { value: "#B25443" },
          info: { value: "#5C7A99" },
        },
      },
      fonts: {
        heading: { value: "var(--font-titulo), sans-serif" },
        body: { value: "var(--font-corpo), sans-serif" },
      },
    },
    recipes,
    slotRecipes,
  },
})

export const system = createSystem(defaultConfig, config)