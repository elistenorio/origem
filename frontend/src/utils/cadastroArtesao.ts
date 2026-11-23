import { OUTRA_TECNICA } from "@/constants/artesao"
import type { CadastroArtesaoInput } from "@/types/artesao"
import type { ArtisanRegistrationData } from "@/types/artisan-registration"

export function cadastroParaInput(d: ArtisanRegistrationData): CadastroArtesaoInput {
  const outras = d.tecnicas.includes(OUTRA_TECNICA)
    ? d.outraTecnica.split(",").map((t) => t.trim()).filter(Boolean)
    : []
  return {
    aceitouTermos: d.aceitouTermos,
    nome: d.nome.trim(),
    email: d.email.trim(),
    senha: d.senha,
    telefone: (d.celular || d.telefone).trim(),
    nomeArtistico: d.nomeArtistico.trim(),
    oficio: d.oficio.trim(),
    tempoAtuacao: d.tempoAtuacao,
    categoria: d.areaAtuacao,
    tecnicas: [...d.tecnicas.filter((t) => t !== OUTRA_TECNICA), ...outras],
    cidade: d.cidade.trim(),
    estado: d.estado,
    regiao: d.regiao,
    historia: d.historia.trim(),
    trabalho: d.trabalho.trim(),
    origemTrabalho: d.origemTrabalho.trim(),
    gostaDeFazer: d.gostaDeFazer.trim(),
    comprovacoes: {
      possuiRegistro: d.possuiRegistro === "sim",
      participouFeiras: d.participouFeiras === "sim",
      pertenceAssociacao: d.pertenceAssociacao === "sim",
      associacao: d.qualAssociacao.trim(),
      links: d.links.map((l) => l.trim()).filter(Boolean),
    },
  }
}
