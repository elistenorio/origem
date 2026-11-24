import type { AnaliseCuradoria } from "@prisma/client"
import { AppError } from "../../shared/AppError"
import { inicioDoMes } from "../../shared/datas"
import { arredondar, formatarReais } from "../../shared/dinheiro"
import type { NotificacaoArtesao, PainelArtesao } from "../../shared/types/artesao"
import type { Pedido } from "../../shared/types/pedido"
import type { Produto } from "../../shared/types/produto"
import { artesaosRepository } from "../repositories/artesaos.repository"
import { avaliacoesRepository } from "../repositories/avaliacoes.repository"
import { curadoriaRepository } from "../repositories/curadoria.repository"
import { pedidosRepository } from "../repositories/pedidos.repository"
import { produtosRepository } from "../repositories/produtos.repository"

const SEMANA_MS = 7 * 24 * 60 * 60 * 1000
const LIMITE_NOTIFICACOES = 5

const quantidade = (pedido: Pedido) => pedido.itens.reduce((s, i) => s + i.quantidade, 0)
const valor = (pedido: Pedido) => pedido.itens.reduce((s, i) => s + i.precoUnitario * i.quantidade, 0)

function notificacaoDeCuradoria(analise: AnaliseCuradoria, produtos: Produto[]): NotificacaoArtesao {
  if (analise.tipo === "artesaos") {
    const titulo = { aprovar: "Seu perfil foi aprovado", ajustes: "A curadoria pediu ajustes no seu perfil", recusar: "Seu cadastro foi recusado" }[analise.decisao]
    const descricao = analise.decisao === "aprovar" ? "Seu perfil já aparece para os visitantes do Origem." : analise.parecer
    return { titulo, descricao, data: analise.data }
  }
  const peca = produtos.find((p) => p.id === analise.itemId)?.titulo ?? "sua peça"
  const titulo = { aprovar: "Peça aprovada", ajustes: "A curadoria pediu ajustes numa peça", recusar: "Peça recusada" }[analise.decisao]
  const descricao = analise.decisao === "aprovar" ? `“${peca}” já está na vitrine.` : `“${peca}”: ${analise.parecer}`
  return { titulo, descricao, data: analise.data }
}

export const painelArtesaoService = {
  async painel(usuarioId: string, agora = new Date()): Promise<PainelArtesao> {
    const perfil = await artesaosRepository.buscarPerfilDoUsuario(usuarioId)
    if (!perfil) throw new AppError(404, "NOT_FOUND", "Perfil de artesão não encontrado.")

    const produtos = await produtosRepository.listarDoArtesao(perfil.id)
    const [pedidos, avaliacoes, decisoes] = await Promise.all([
      pedidosRepository.listarComItensDoArtesao(perfil.id),
      avaliacoesRepository.listarDoArtesao(perfil.id),
      curadoriaRepository.listarDecisoesDoArtesao(perfil.id, produtos.map((p) => p.id)),
    ])

    const validos = pedidos.filter((p) => p.status !== "cancelado")
    const semana = new Date(agora.getTime() - SEMANA_MS)
    const mes = inicioDoMes(agora)

    const notificacoes: NotificacaoArtesao[] = [
      ...validos.map((p) => ({
        titulo: "Novo pedido recebido",
        descricao: `${p.itens.map((i) => i.titulo).join(", ")} · ${formatarReais(valor(p))}`,
        data: p.criadoEm,
      })),
      ...avaliacoes.map((a) => ({
        titulo: "Sua peça recebeu uma avaliação",
        descricao: `O pedido #${a.pedidoId} foi avaliado em ${a.nota} ${a.nota === 1 ? "estrela" : "estrelas"}.`,
        data: a.criadoEm,
      })),
      ...decisoes.map((d) => notificacaoDeCuradoria(d, produtos)),
    ]
      .sort((a, b) => b.data.getTime() - a.data.getTime())
      .slice(0, LIMITE_NOTIFICACOES)

    const somaNotas = avaliacoes.reduce((s, a) => s + a.nota, 0)

    return {
      nome: perfil.nome,
      status: perfil.status,
      parecerCuradoria: perfil.parecerCuradoria,
      publicadas: produtos.filter((p) => p.status === "publicado").length,
      vendidasSemana: validos.filter((p) => p.criadoEm >= semana).reduce((s, p) => s + quantidade(p), 0),
      vendasMes: arredondar(validos.filter((p) => p.criadoEm >= mes).reduce((s, p) => s + valor(p), 0)),
      avaliacaoMedia: avaliacoes.length > 0 ? Math.round((somaNotas / avaliacoes.length) * 10) / 10 : null,
      totalAvaliacoes: avaliacoes.length,
      notificacoes,
    }
  },
}
