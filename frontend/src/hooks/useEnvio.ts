"use client"

import { useState } from "react"
import { ApiError } from "@/services/api"

export function useEnvio(mensagemPadrao: string) {
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string>()

  async function enviar(acao: () => Promise<void>): Promise<boolean> {
    setEnviando(true)
    setErro(undefined)
    try {
      await acao()
      return true
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : mensagemPadrao)
      return false
    } finally {
      setEnviando(false)
    }
  }

  return { enviando, erro, setErro, enviar }
}
