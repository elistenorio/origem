import { anoMesEmRecife, diaMesEmRecife, inicioDoMesEm } from "../../shared/datas"
import { arredondar } from "../../shared/dinheiro"
import type { Indicadores, PeriodoIndicadores } from "../../shared/types/admin"
import { adminRepository } from "../repositories/admin.repository"

const DIA_MS = 24 * 60 * 60 * 1000
const DIAS_DO_PERIODO: Record<PeriodoIndicadores, number> = { "7d": 7, "30d": 30, "12m": 365 }
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]
const SEMANAS = 8
const CATEGORIAS_NO_GRAFICO = 5

type PedidoResumido = Awaited<ReturnType<typeof adminRepository.listarPedidosParaIndicadores>>[number]

function somar(pedidos: PedidoResumido[]) {
  const faturamento = arredondar(pedidos.reduce((soma, p) => soma + p.total, 0))
  const quantidade = pedidos.length
  const pecasVendidas = pedidos.reduce((soma, p) => soma + p.itens.reduce((s, i) => s + i.quantidade, 0), 0)
  const ticketMedio = quantidade > 0 ? arredondar(faturamento / quantidade) : 0
  return { faturamento, pedidos: quantidade, ticketMedio, pecasVendidas }
}

function variacao(atual: number, anterior: number): number {
  if (anterior === 0) return atual > 0 ? 100 : 0
  return Math.round(((atual - anterior) / anterior) * 100)
}

const entre = (pedidos: PedidoResumido[], inicio: Date, fim: Date) =>
  pedidos.filter((p) => p.criadoEm >= inicio && p.criadoEm < fim)

function faturamentoMensal(pedidos: PedidoResumido[], agora: Date) {
  const { ano, mes } = anoMesEmRecife(agora)
  return Array.from({ length: 12 }, (_, i) => {
    const m = mes - 11 + i
    const total = (offsetAnos: number) =>
      arredondar(entre(pedidos, inicioDoMesEm(ano - offsetAnos, m), inicioDoMesEm(ano - offsetAnos, m + 1)).reduce((s, p) => s + p.total, 0))
    return { mes: MESES[((m % 12) + 12) % 12], atual: total(0), anterior: total(1) }
  })
}

function vendasPorCategoria(pedidos: PedidoResumido[]) {
  const porCategoria = new Map<string, number>()
  for (const pedido of pedidos) {
    for (const item of pedido.itens) {
      const categoria = item.produto.categoria.label
      porCategoria.set(categoria, (porCategoria.get(categoria) ?? 0) + item.quantidade)
    }
  }
  const ordenadas = [...porCategoria].map(([categoria, quantidade]) => ({ categoria, quantidade })).sort((a, b) => b.quantidade - a.quantidade)
  const principais = ordenadas.slice(0, CATEGORIAS_NO_GRAFICO)
  const outras = ordenadas.slice(CATEGORIAS_NO_GRAFICO).reduce((s, c) => s + c.quantidade, 0)
  return outras > 0 ? [...principais, { categoria: "Outras", quantidade: outras }] : principais
}

function pedidosPorSemana(pedidos: PedidoResumido[], agora: Date) {
  return Array.from({ length: SEMANAS }, (_, i) => {
    const inicio = new Date(agora.getTime() - (SEMANAS - i) * 7 * DIA_MS)
    const fim = new Date(inicio.getTime() + 7 * DIA_MS)
    return { semana: diaMesEmRecife(inicio), quantidade: entre(pedidos, inicio, fim).length }
  })
}

export const indicadoresService = {
  async calcular(periodo: PeriodoIndicadores, agora = new Date()): Promise<Indicadores> {
    const duracao = DIAS_DO_PERIODO[periodo] * DIA_MS
    const inicio = new Date(agora.getTime() - duracao)
    const inicioAnterior = new Date(inicio.getTime() - duracao)
    const { ano, mes } = anoMesEmRecife(agora)
    const desde = new Date(Math.min(inicioAnterior.getTime(), inicioDoMesEm(ano - 1, mes - 11).getTime(), agora.getTime() - SEMANAS * 7 * DIA_MS))

    const [pedidos, ativos] = await Promise.all([adminRepository.listarPedidosParaIndicadores(desde), adminRepository.contarAtivos()])
    const doPeriodo = entre(pedidos, inicio, agora)
    const atual = somar(doPeriodo)
    const anterior = somar(entre(pedidos, inicioAnterior, inicio))

    return {
      periodo,
      ...atual,
      ...ativos,
      variacoes: {
        faturamento: variacao(atual.faturamento, anterior.faturamento),
        pedidos: variacao(atual.pedidos, anterior.pedidos),
        ticketMedio: variacao(atual.ticketMedio, anterior.ticketMedio),
        pecasVendidas: variacao(atual.pecasVendidas, anterior.pecasVendidas),
      },
      faturamentoMensal: faturamentoMensal(pedidos, agora),
      vendasPorCategoria: vendasPorCategoria(doPeriodo),
      pedidosPorSemana: pedidosPorSemana(pedidos, agora),
    }
  },
}
