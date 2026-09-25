import type { ApiError } from "@/services/api"
import { LoadingState } from "./LoadingState"
import { ErrorState } from "./ErrorState"
import { EmptyMessage } from "./EmptyMessage"

type DataStateProps = {
  loading: boolean
  error?: ApiError
  vazio?: boolean
  mensagemVazio?: string
  descricaoVazio?: string
  acaoVazio?: React.ReactNode   // botão opcional no estado vazio (ex.: "Limpar filtros")
  onRetry?: () => void
  children: React.ReactNode
}

// Decide o que mostrar: carregando, erro, vazio ou o conteúdo.
// Evita repetir o mesmo if/else em toda tela que busca dados.
export function DataState({ loading, error, vazio, mensagemVazio = "Nada por aqui ainda.", descricaoVazio, acaoVazio, onRetry, children }: DataStateProps) {
  if (error) return <ErrorState mensagem={error.message} onRetry={onRetry} />
  if (loading && vazio !== false) return <LoadingState />
  if (vazio) return <EmptyMessage titulo={mensagemVazio} descricao={descricaoVazio}>{acaoVazio}</EmptyMessage>
  return <>{children}</>
}
