import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import { recipes, slotRecipes } from "./recipes"

// Paleta "Origem 2.0": fundo creme claro, superfícies brancas, terracota nos destaques
// e marrom só no texto. Os nomes dos tokens continuam os mesmos de antes, então os
// componentes não precisam mudar. Todos os textos passam no contraste mínimo de 4,5:1.
const config = defineConfig({
  globalCss: {
    body: { bg: "origem.fundo", color: "origem.texto", fontSize: "md", lineHeight: "1.55" },
  },
  theme: {
    tokens: {
      colors: {
        origem: {
          laranja: { value: "#A8522A" }, // terracota: botões principais, links e destaques
          laranjaEscuro: { value: "#8A4320" }, // hover de botões e chips terracota
          marrom: { value: "#6B5549" }, // preços e textos de apoio fortes
          fundo: { value: "#FBF8F4" }, // fundo das páginas
          texto: { value: "#2E1E19" },
          textoSuave: { value: "#6B5549" },
          busca: { value: "#F3E6DC" }, // areia: fundos de destaque leve e hover
          categoria: { value: "#F3E6DC" },
          passoFundo: { value: "#FFFFFF" }, // painéis e cartões
          passoInativo: { value: "#E8DDD2" },
          linha: { value: "#E8DDD2" }, // bordas suaves de cartões e divisórias
          borda: { value: "#8C7B70" }, // borda visível dos campos de formulário
          // Cores de status (selos de pedido/estoque), todas com contraste de leitura
          sucesso: { value: "#017054" },
          aviso: { value: "#F8E3A3" }, // usado com texto escuro
          perigo: { value: "#B03A22" },
          info: { value: "#1F6FA3" },
        },
      },
      fonts: {
        heading: { value: "var(--font-titulo), sans-serif" },
        body: { value: "var(--font-corpo), sans-serif" },
      },
      // Escala de texto maior que a padrão do Chakra, para leitura fácil:
      // nenhum texto fica abaixo de 16px e o corpo é 18px.
      fontSizes: {
        "2xs": { value: "1rem" },
        xs: { value: "1rem" },
        sm: { value: "1rem" },
        md: { value: "1.125rem" },
        lg: { value: "1.25rem" },
        xl: { value: "1.375rem" },
        "2xl": { value: "1.625rem" },
      },
    },
    // Estilos de texto repetidos nas telas (use com <Text textStyle="rotulo">)
    textStyles: {
      rotulo: { value: { fontWeight: "bold", fontSize: "md", color: "origem.texto" } },
      apoio: { value: { fontSize: "md", color: "origem.textoSuave" } },
      destaqueLaranja: { value: { fontWeight: "bold", color: "origem.laranja" } },
      preco: { value: { fontSize: "2xl", fontWeight: "bold", color: "origem.texto" } },
      numero: { value: { fontFamily: "heading", fontWeight: "800", fontSize: "4xl", lineHeight: "1", color: "origem.laranja" } },
    },
    recipes,
    slotRecipes,
  },
})

export const system = createSystem(defaultConfig, config)
