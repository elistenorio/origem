import type { OpcaoFiltro } from "./categorias"

// Faixas de "Tempo de atuação" do perfil do artesão (as mesmas que o backend aceita).
export const TEMPO_ATUACAO: OpcaoFiltro[] = [
  { value: "menos-1", label: "Menos de 1 ano" },
  { value: "1-3", label: "1 a 3 anos" },
  { value: "3-10", label: "3 a 10 anos" },
  { value: "mais-10", label: "Mais de 10 anos" },
]

// Técnicas que aparecem como opção no campo "Técnicas que utiliza" (cadastro e perfil).
// O artesão guarda os rótulos; "outra" é a opção de texto livre.
export const TECNICAS_DO_CAMPO = [
  "Modelagem manual", "Torneamento", "Bordado", "Tecelagem", "Entalhe", "Cestaria",
  "Xilogravura", "Pintura à Mão", "Ourivesaria", "Filigrana",
]
export const OUTRA_TECNICA = "outra"
