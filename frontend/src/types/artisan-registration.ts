export type ArtisanRegistrationData = {
  // etapa 1
  nome: string
  email: string
  senha: string
  confirmarSenha: string
  telefone: string
  celular: string
  aceitouTermos: boolean
  // etapa 2
  nomeArtistico: string
  tempoAtuacao: string
  areaAtuacao: string
  tecnicas: string[]
  outraTecnica: string
  cidade: string
  estado: string
  // etapa 3
  historia: string
  trabalho: string
  origemTrabalho: string
  gostaDeFazer: string
  // etapa 4
  possuiRegistro: string
  participouFeiras: string
  pertenceAssociacao: string
  qualAssociacao: string
  links: string[]
  // etapa 5
  fotoPerfil: File[]
  fotosPecas: File[]
  fotosProcessos: File[]
}

export const initialRegistrationData: ArtisanRegistrationData = {
  nome: "", email: "", senha: "", confirmarSenha: "",
  telefone: "", celular: "", aceitouTermos: false,
  nomeArtistico: "", tempoAtuacao: "menos-1", areaAtuacao: "ceramica",
  tecnicas: [], outraTecnica: "", cidade: "", estado: "",
  historia: "", trabalho: "", origemTrabalho: "", gostaDeFazer: "",
  possuiRegistro: "sim", participouFeiras: "sim", pertenceAssociacao: "sim",
  qualAssociacao: "", links: ["", "", ""],
  fotoPerfil: [], fotosPecas: [], fotosProcessos: [],
}

// Props que TODA etapa recebe do wizard
export type StepProps = {
  data: ArtisanRegistrationData
  onChange: <K extends keyof ArtisanRegistrationData>(
    field: K,
    value: ArtisanRegistrationData[K],
  ) => void
  onNext: () => void
}