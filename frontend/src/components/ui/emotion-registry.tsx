"use client"

import { useState } from "react"
import { useServerInsertedHTML } from "next/navigation"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"

export function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "css" })
    cache.compat = true

    const inserirOriginal = cache.insert
    let inseridos: string[] = []

    cache.insert = (...args) => {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) inseridos.push(serialized.name)
      return inserirOriginal(...args)
    }

    const flush = () => {
      const anteriores = inseridos
      inseridos = []
      return anteriores
    }

    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const nomes = flush()
    if (nomes.length === 0) return null

    return (
      <style
        data-emotion={`${cache.key} ${nomes.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: nomes.map((nome) => cache.inserted[nome]).join("") }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
