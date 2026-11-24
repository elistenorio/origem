import type { AnaliseCuradoria, DecisaoCuradoria, TipoCuradoria } from "@prisma/client"
import { AppError } from "../../shared/AppError"
import { formatarReais } from "../../shared/dinheiro"
import type { TokenPayload } from "../../shared/jwt"
import type { ComprovacoesArtesao } from "../../shared/types/artesao"
import type { DecidirCuradoriaInput, ItemCuradoria } from "../../shared/types/curadoria"
import { produtosCache } from "../cache/produtos.cache"
import { curadoriaRepository } from "../repositories/curadoria.repository"
import { usuariosRepository } from "../repositories/usuarios.repository"

const STATUS_POR_DECISAO = {
  aprovar: "publicado",
  ajustes: "ajustesSolicitados",
  recusar: "recusado",
} as const satisfies Record<DecisaoCuradoria, string>

const ROTULO_DECISAO: Record<DecisaoCuradoria, string> = {
  aprovar: "Aprovado",
  ajustes: "Ajustes solicitados",
  recusar: "Recusado",
}

const NOME_ITEM: Record<TipoCuradoria, { artigo: string; contracao: string; nome: string; naoEncontrado: string }> = {
  artesaos: { artigo: "o artesão", contracao: "no artesão", nome: "Este artesão", naoEncontrado: "Artesão não encontrado." },
  pecas: { artigo: "a peça", contracao: "na peça", nome: "Esta peça", naoEncontrado: "Peça não encontrada." },
}


function descreverAtividade(tipo: TipoCuradoria, decisao: DecisaoCuradoria, nome: string): string {
  const item = NOME_ITEM[tipo]
  if (decisao === "aprovar") return `aprovou ${item.artigo} “${nome}”`
  if (decisao === "ajustes") return `pediu ajustes ${item.contracao} “${nome}”`
  return `recusou ${item.artigo} “${nome}”`
}

function historico(enviado: { titulo: string; data: Date }, analises: AnaliseCuradoria[], itemId: string) {
  const doItem = analises
    .filter((a) => a.itemId === itemId)
    .map((a) => ({ titulo: `${ROTULO_DECISAO[a.decisao]} por ${a.autor}${a.parecer ? `: “${a.parecer}”` : ""}`, data: a.data }))
  return [enviado, ...doItem]
}

function linhasDeComprovacao(json: unknown): ItemCuradoria["comprovacoes"] {
  if (!json || typeof json !== "object") return undefined
  const c = json as Partial<ComprovacoesArtesao>
  const simNao = (valor?: boolean) => (valor ? "Sim" : "Não")
  return [
    { rotulo: "Possui registro ou certificação", valor: simNao(c.possuiRegistro) },
    { rotulo: "Já participou de feiras ou exposições", valor: simNao(c.participouFeiras) },
    { rotulo: "Associação ou coletivo", valor: c.pertenceAssociacao ? c.associacao || "Sim" : "Não" },
    ...(c.links ?? []).map((link) => ({ rotulo: "Link", valor: link })),
  ]
}

export const curadoriaService = {
  async listar(tipo: TipoCuradoria): Promise<ItemCuradoria[]> {
    if (tipo === "artesaos") {
      const artesaos = await curadoriaRepository.listarArtesaosEmAnalise()
      const analises = await curadoriaRepository.listarAnalises(tipo, artesaos.map((a) => a.id))
      return artesaos.map((a) => ({
        id: a.id,
        tipo,
        titulo: a.nome,
        subtitulo: `${a.cidade}/${a.estado} · ${a.oficio}`,
        enviadoEm: a.criadoEm,
        imagemUrl: a.fotoUrl,
        fotos: [a.fotoUrl],
        descricao: a.bio,
        trajetoria: a.historia,
        documentos: [],
        comprovacoes: linhasDeComprovacao(a.comprovacoes),
        historico: historico({ titulo: "Cadastro concluído", data: a.criadoEm }, analises, a.id),
      }))
    }

    const pecas = await curadoriaRepository.listarPecasEmAnalise()
    const analises = await curadoriaRepository.listarAnalises(tipo, pecas.map((p) => p.id))
    return pecas.map((p) => ({
      id: p.id,
      tipo,
      titulo: p.titulo,
      subtitulo: `${p.artesao.nome} · ${p.tecnica.label}`,
      enviadoEm: p.criadoEm,
      imagemUrl: p.imagemUrl,
      fotos: p.imagens.length > 0 ? p.imagens : [p.imagemUrl],
      descricao: [p.descricao, p.medidas, formatarReais(p.preco)].filter(Boolean).join(" · "),
      documentos: [],
      historico: historico({ titulo: "Peça enviada para análise", data: p.criadoEm }, analises, p.id),
    }))
  },

  async decidir(tipo: TipoCuradoria, id: string, input: DecidirCuradoriaInput, usuario: TokenPayload): Promise<void> {
    const item = await curadoriaRepository.buscarItem(tipo, id)
    if (!item) throw new AppError(404, "NOT_FOUND", NOME_ITEM[tipo].naoEncontrado)

    const naoEstaEmAnalise = new AppError(409, "CONFLICT", `${NOME_ITEM[tipo].nome} não está aguardando análise.`)
    if (item.status !== "emAnalise") throw naoEstaEmAnalise

    const autor = (await usuariosRepository.buscarPorId(usuario.id))?.nome ?? "Equipe Origem"
    const decidido = await curadoriaRepository.decidir({
      tipo,
      itemId: id,
      decisao: input.decisao,
      status: STATUS_POR_DECISAO[input.decisao],
      parecer: input.parecer,
      autor,
      atividade: descreverAtividade(tipo, input.decisao, item.nome),
    })
    if (!decidido) throw naoEstaEmAnalise

    await produtosCache.invalidar()
  },
}
