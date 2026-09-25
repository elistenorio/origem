"use client"

import { useSyncExternalStore } from "react"

const semInscricao = () => () => {}

// false no servidor e na primeira renderização do navegador; true depois de montar.
// Usado por telas que leem stores com `persist` (localStorage), que o servidor não enxerga:
// esperar montar evita o erro de hidratação (o HTML do servidor diferente do primeiro render).
export function useHasMounted() {
  return useSyncExternalStore(semInscricao, () => true, () => false)
}
