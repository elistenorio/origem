import { inicioDoDia, inicioDoMes } from "../../shared/datas"
import type { PainelAdmin } from "../../shared/types/admin"
import { adminRepository } from "../repositories/admin.repository"

// Valores em reais com 2 casas.
const arredondar = (valor: number) => Math.round(valor * 100) / 100

export const adminService = {
  /**
   * GET /admin/painel: tela inicial do administrador.
   * Todos os números são contados no banco (na Fake API, pedidos de hoje, vendas do mês e clientes eram fixos).
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
}
