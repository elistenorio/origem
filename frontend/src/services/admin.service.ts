import { api } from "./api"
import type { PainelAdmin } from "@/types/admin"

// Chamadas das telas do administrador.
export const adminService = {
  /** GET /admin/painel: resumo, pendências, notificações e atividades da tela inicial. */
  async painel() {
    const response = await api.get<PainelAdmin>("/admin/painel")
    return response.data
  },
}
