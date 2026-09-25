"use client"

import { useEffect, useState, type DependencyList } from "react"
import { ApiError } from "@/services/api"

// Ciclo de vida de uma chamada à API (aula 05): carregando → dados ou erro → fim do carregamento.
// Escrito uma vez aqui para todas as telas não repetirem o mesmo useEffect + useState.
//
// Uso: const { data, loading, error, recarregar } = useApi(() => produtosService.listar(filtros), [filtros])
// A busca roda de novo sempre que algum valor de `deps` mudar (como no array de dependências do useEffect).
export function useApi<T>(buscar: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<ApiError>()
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true // evita atualizar a tela com uma resposta antiga, se os filtros mudarem no meio

    async function carregar() {
      setLoading(true)
      setError(undefined)
      try {
        const resultado = await buscar()
        if (ativo) setData(resultado)
      } catch (erro) {
        if (!ativo) return
        setData(undefined) // descarta o resultado anterior, para a tela não mostrar dados velhos junto com o erro
        setError(erro instanceof ApiError ? erro : new ApiError("UNKNOWN", "Erro inesperado.", 0))
      } finally {
        if (ativo) setLoading(false)
      }
    }

    carregar()
    return () => {
      ativo = false
    }
    // `buscar` é uma função nova a cada render; quem decide quando buscar de novo é `deps`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tentativa])

  return { data, loading, error, recarregar: () => setTentativa((t) => t + 1) }
}
