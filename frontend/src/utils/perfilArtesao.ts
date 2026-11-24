import { OUTRA_TECNICA, TECNICAS_DO_CAMPO } from "@/constants/artesao"
import type { PerfilArtesao, PerfilArtesaoInput } from "@/types/artesao"

// Estado do formulário "Meu perfil": os campos de PerfilArtesaoInput, com as técnicas
// separadas em "marcadas na lista" e "outras" (texto livre, separado por vírgula).
export type FormularioPerfil = Omit<PerfilArtesaoInput, "tecnicas"> & {
  tecnicasMarcadas: string[]
  outrasTecnicas: string
}

// Preenche o formulário com o perfil salvo. Técnicas fora da lista vão para "Outra".
export function perfilParaFormulario(p: PerfilArtesao): FormularioPerfil {
  const conhecidas = p.tecnicas.filter((t) => TECNICAS_DO_CAMPO.includes(t))
  const outras = p.tecnicas.filter((t) => !TECNICAS_DO_CAMPO.includes(t))
  return {
    nome: p.nome,
    cidade: p.cidade,
    estado: p.estado,
    telefone: p.telefone,
    historia: p.historia,
    trabalho: p.trabalho ?? "",
    origemTrabalho: p.origemTrabalho ?? "",
    gostaDeFazer: p.gostaDeFazer ?? "",
    tempoAtuacao: p.tempoAtuacao,
    categorias: p.categorias,
    tecnicasMarcadas: outras.length > 0 ? [...conhecidas, OUTRA_TECNICA] : conhecidas,
    outrasTecnicas: outras.join(", "),
  }
}

// Monta o que vai para PUT /minha-conta/perfil.
export function formularioParaPerfil(f: FormularioPerfil): PerfilArtesaoInput {
  const { tecnicasMarcadas, outrasTecnicas, ...resto } = f
  const outras = tecnicasMarcadas.includes(OUTRA_TECNICA)
    ? outrasTecnicas.split(",").map((t) => t.trim()).filter(Boolean)
    : []
  return { ...resto, tecnicas: [...tecnicasMarcadas.filter((t) => t !== OUTRA_TECNICA), ...outras] }
}

// Mesmas regras do backend; devolve uma mensagem por campo.
export function validarPerfil(f: FormularioPerfil): Partial<Record<keyof FormularioPerfil, string>> {
  const erros: Partial<Record<keyof FormularioPerfil, string>> = {}
  if (!f.nome.trim()) erros.nome = "Informe o nome que vai aparecer no Origem."
  if (!f.cidade.trim()) erros.cidade = "Informe sua cidade."
  if (!/^[A-Za-z]{2}$/.test(f.estado.trim())) erros.estado = "Use 2 letras (ex.: PE)."
  if (f.telefone && f.telefone.replace(/\D/g, "").length < 10) erros.telefone = "Informe o telefone com DDD."
  if (!f.historia.trim()) erros.historia = "Conte um pouco da sua história."
  if (f.categorias.length === 0) erros.categorias = "Escolha sua área de atuação."
  return erros
}
