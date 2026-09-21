// Aparência comum a todos os campos do design (fundo bege, cantos, altura mínima)
export const inputStyle = {
  bg: "origem.busca",
  border: "none",
  borderRadius: "lg",
  color: "origem.texto",
  minH: "50px",
  _placeholder: { color: "origem.textoSuave" },
} as const

// Rótulos em maiúsculas e negrito
export const labelStyle = {
  textTransform: "uppercase",
  fontWeight: "bold",
  color: "origem.texto",
} as const