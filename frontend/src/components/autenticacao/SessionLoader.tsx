"use client"

import { useEffect } from "react"
import { useSessao } from "@/hooks/useSessao"

// Confere a sessão (GET /auth/me) uma vez, quando o site abre. Não desenha nada.
// Fica no layout raiz, então vale para todas as páginas.
export function SessionLoader() {
  const { carregar } = useSessao()

  useEffect(() => {
    carregar()
    // Só ao montar: depois disso, login e logout atualizam o store diretamente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
