"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

// Filtros de listagem guardados na URL (?busca=...&categoria=...): dá para compartilhar
// o link e o botão "voltar" funciona. Trocar um filtro volta para a página 1.
export function useUrlFilters<K extends string>(chaves: readonly K[]) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const valores = Object.fromEntries(chaves.map((k) => [k, params.get(k) ?? undefined])) as Record<K, string | undefined>
  const page = Number(params.get("page")) || 1

  function atualizar(novos: Partial<Record<K | "page", string | undefined>>) {
    const proximos = new URLSearchParams(params.toString())
    for (const [chave, valor] of Object.entries(novos)) {
      if (valor) proximos.set(chave, String(valor))
      else proximos.delete(chave)
    }
    if (!("page" in novos)) proximos.delete("page")
    const qs = proximos.toString()
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false })
  }

  const limpar = () => router.replace(pathname, { scroll: false })

  return { valores, page, atualizar, limpar }
}
