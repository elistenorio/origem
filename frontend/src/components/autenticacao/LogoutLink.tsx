"use client"

import { useRouter } from "next/navigation"
import { Link, type LinkProps } from "@chakra-ui/react"
import { useSessao } from "@/hooks/useSessao"

// "Sair": faz logout (o backend apaga o cookie) e volta para a home.
// Aceita as props de estilo do Link do Chakra (ex.: css da recipe do menu).
export function LogoutLink({ children = "Sair", ...props }: LinkProps) {
  const router = useRouter()
  const { sair } = useSessao()

  async function handleClick() {
    await sair()
    router.push("/")
  }

  return (
    <Link asChild {...props}>
      <button type="button" onClick={handleClick}>
        {children}
      </button>
    </Link>
  )
}
