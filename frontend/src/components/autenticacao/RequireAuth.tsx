"use client"

import { useEffect } from "react"
import NextLink from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@chakra-ui/react"
import { EmptyMessage } from "@/components/feedback/EmptyMessage"
import { LoadingState } from "@/components/feedback/LoadingState"
import { INICIO_POR_PERFIL } from "@/constants/perfis"
import { useSessao } from "@/hooks/useSessao"
import type { PerfilUsuario } from "@/types/usuario"

type RequireAuthProps = {
  perfis?: PerfilUsuario[] // sem perfis: qualquer usuário logado entra
  children: React.ReactNode
}

// Protege uma área do site no navegador:
// - enquanto a sessão não foi conferida, mostra "carregando";
// - sem login, manda para /login e volta para esta página depois de entrar;
// - com o perfil errado, avisa e oferece o caminho da área certa.
// A proteção de verdade é no backend (401/403): isto só evita mostrar uma tela que não vai carregar.
export function RequireAuth({ perfis, children }: RequireAuthProps) {
  const { usuario, verificado } = useSessao()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (verificado && !usuario) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
  }, [verificado, usuario, pathname, router])

  if (!verificado || !usuario) return <LoadingState mensagem="Verificando seu acesso..." />

  if (perfis && !perfis.includes(usuario.perfil)) {
    return (
      <EmptyMessage titulo="Esta área não é do seu perfil" descricao="Você está logado com uma conta que não tem acesso a esta página.">
        <Button asChild variant="origem">
          <NextLink href={INICIO_POR_PERFIL[usuario.perfil]}>Ir para a minha área</NextLink>
        </Button>
      </EmptyMessage>
    )
  }

  return <>{children}</>
}
