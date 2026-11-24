import { diasDesde, inicioDoDia, inicioDoMes } from "../../shared/datas"
import { arredondar } from "../../shared/dinheiro"
import type { Acompanhamento, Alerta, PainelAdmin } from "../../shared/types/admin"
import type { Pedido } from "../../shared/types/pedido"
import { adminRepository } from "../repositories/admin.repository"
import { artesaosRepository } from "../repositories/artesaos.repository"
import { pedidosRepository } from "../repositories/pedidos.repository"
import { produtosRepository } from "../repositories/produtos.repository"

const DIAS_PARA_ATRASO = 3
const DIAS_PARA_ATRASO_GRAVE = 7
const LIMITE_ALERTAS = 5
const LIMITE_ARTESAOS_RECENTES = 3
const LIMITE_PRODUTOS_PENDENTES = 5
const LIMITE_ATIVIDADES = 5

function alertaDeAtraso(pedido: Pedido, agora: Date): Alerta {
  const dias = diasDesde(pedido.criadoEm, agora)
  return {
    id: `atraso-${pedido.id}`,
    titulo: "Envio atrasado",
    descricao: `Pedido ${pedido.codigo} aguardando envio há ${dias} dias`,
    gravidade: dias > DIAS_PARA_ATRASO_GRAVE ? "alta" : "media",
  }
}

export const adminService = {
  /**
   * GET /admin/painel: tela inicial do administrador.
   * Todos os números são contados no banco.
   * "Hoje" e "este mês" seguem o horário de Recife.
   */
  async painel(agora = new Date()): Promise<PainelAdmin> {
    const [contagens, notificacoes, atividades] = await Promise.all([
      adminRepository.contar({ desdeHoje: inicioDoDia(agora), desdeMes: inicioDoMes(agora) }),
      adminRepository.listarNotificacoes(),
      adminRepository.listarAtividades(),
    ])

    return {
      resumo: {
        pedidosHoje: contagens.pedidosHoje,
        vendasMes: arredondar(contagens.vendasMes),
        clientes: contagens.clientes,
        artesaosAtivos: contagens.artesaosAtivos,
        produtosPublicados: contagens.produtosPublicados,
      },
      pendencias: [
        { id: "pd1", titulo: "Artesãos aguardando curadoria", quantidade: contagens.artesaosEmAnalise, href: "/admin/curadoria" },
        { id: "pd2", titulo: "Peças aguardando aprovação", quantidade: contagens.pecasEmAnalise, href: "/admin/curadoria" },
        { id: "pd3", titulo: "Pedidos em processamento", quantidade: contagens.pedidosEmProcessamento, href: "/admin/acompanhamento" },
      ],
      notificacoes,
      atividades,
    }
  },

  async acompanhamento(agora = new Date()): Promise<Acompanhamento> {
    const limiteAtraso = new Date(agora.getTime() - DIAS_PARA_ATRASO * 24 * 60 * 60 * 1000)
    const [contagem, atrasados, artesaosRecentes, produtosPendentes, atividades] = await Promise.all([
      pedidosRepository.contarPorStatus(),
      pedidosRepository.listarAguardandoEnvioDesde(limiteAtraso),
      artesaosRepository.listarRecentes(LIMITE_ARTESAOS_RECENTES),
      produtosRepository.listarEmAnalise(LIMITE_PRODUTOS_PENDENTES),
      adminRepository.listarAtividades(),
    ])

    return {
      contagem: {
        processando: contagem.processando + contagem.emSeparacao,
        enviado: contagem.enviado,
        entregue: contagem.entregue,
        cancelado: contagem.cancelado,
      },
      alertas: atrasados.slice(0, LIMITE_ALERTAS).map((pedido) => alertaDeAtraso(pedido, agora)),
      artesaosRecentes,
      produtosPendentes,
      atividades: atividades.slice(0, LIMITE_ATIVIDADES),
    }
  },
}
