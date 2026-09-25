import dados from "./db.json"
import type { Alerta, Atividade, Indicadores, ItemCuradoria, Notificacao, ResumoPlataforma } from "@/types/admin"
import type { Artesao } from "@/types/artesao"
import type { Avaliacao } from "@/types/avaliacao"
import type { Pedido } from "@/types/pedido"
import type { Produto } from "@/types/produto"
import type { MinhaConta, Usuario } from "@/types/usuario"

// "Banco" da Fake API: cada lista do db.json é uma "tabela" (na Avaliação 2 vira o seed do Prisma).
// Só as rotas de src/app/api/ importam este arquivo.

// Dados da "Minha conta" guardados à parte do usuário, ligados pelo usuarioId.
type Conta = { usuarioId: string } & Pick<MinhaConta, "cpf" | "telefone" | "endereco" | "formasPagamento">

type Banco = {
  produtos: Produto[]
  artesaos: Artesao[]
  usuarios: Usuario[]
  contas: Conta[]
  pedidos: Pedido[]
  avaliacoes: Avaliacao[]
  curadoria: ItemCuradoria[]
  atividades: Atividade[]
  notificacoesAdmin: Notificacao[]
  alertas: Alerta[]
  resumoPlataforma: Pick<ResumoPlataforma, "pedidosHoje" | "vendasMes" | "clientes">
  indicadores: Indicadores[]
}

// O JSON não guarda tipos (ex.: "publicado" vira só string): aqui dizemos ao TypeScript
// que o conteúdo segue os tipos de src/types. As rotas que gravam (POST/PATCH) alteram
// estas listas em memória, como o `let DB` da aula 06: vale até o servidor reiniciar.
export const db = dados as Banco
