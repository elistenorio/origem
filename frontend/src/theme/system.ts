import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  // estilos aplicados ao site inteiro
  globalCss: {
    body: { bg: "origem.fundo", color: "origem.texto" },
  },
  theme: {
    tokens: {
      colors: {
        origem: {
          laranja: { value: "#CF804F" },   // botões, títulos, tags, bordas
          marrom: { value: "#A68B78" },    // barra de topo e rodapé
          fundo: { value: "#EDEEE8" },     // fundo da página
          texto: { value: "#432A25" },     // texto escuro
          textoSuave: { value: "#958177" },// medidas, preços
          busca: { value: "#E7D8CA" },     // campo de busca
          categoria: { value: "#DDB79B" }, // botões de categoria
          passoFundo: { value: "#DBD6CE" },   // fundo da pílula
          passoInativo: { value: "#D8BCA9" }, // bolinhas inativas
        },
      },
    },
  },
})

// defaultConfig = tudo que o Chakra já traz; "config" = suas customizações por cima
export const system = createSystem(defaultConfig, config)