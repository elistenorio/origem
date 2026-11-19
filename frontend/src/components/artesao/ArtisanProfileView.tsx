"use client"

import { useApi } from "@/hooks/useApi"
import { minhaContaService } from "@/services/minhaConta.service"
import { DataState } from "@/components/feedback/DataState"
import { ArtisanShell } from "./ArtisanShell"
import { ArtisanProfileForm } from "./ArtisanProfileForm"

// "Meu perfil" do artesão: busca o perfil (GET /minha-conta/perfil) e mostra o formulário.
export function ArtisanProfileView() {
  const { data: perfil, loading, error, recarregar } = useApi(() => minhaContaService.perfil(), [])

  return (
    <ArtisanShell ativo="perfil">
      <DataState loading={loading} error={error} onRetry={recarregar}>
        {perfil && <ArtisanProfileForm key={perfil.id} perfil={perfil} />}
      </DataState>
    </ArtisanShell>
  )
}
