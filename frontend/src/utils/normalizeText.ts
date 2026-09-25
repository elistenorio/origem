// "Cerâmica" -> "ceramica": busca sem diferenciar acento nem maiúscula.
export const normalizeText = (texto: string) =>
  texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim()
