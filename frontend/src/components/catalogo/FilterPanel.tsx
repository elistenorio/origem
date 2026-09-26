"use client"

import { useState } from "react"
import { Button, HStack, Stack } from "@chakra-ui/react"
import { SectionCard } from "@/components/common/SectionCard"
import { SelectField } from "@/components/common/SelectField"
import { FormField } from "@/components/common/FormField"
import { AppCheckbox } from "@/components/common/AppCheckbox"
import { DataState } from "@/components/feedback/DataState"
import { useApi } from "@/hooks/useApi"
import { produtosService } from "@/services/produtos.service"

export type FiltrosPainel = {
  categoria?: string
  tecnica?: string
  material?: string
  regiao?: string
  precoMin?: string
  precoMax?: string
  disponivel?: string
}

type FilterPanelProps = {
  valores: FiltrosPainel
  onAplicar: (filtros: FiltrosPainel) => void
  onLimpar: () => void
}

const comTodas = (opcoes: { value: string; label: string }[]) => [{ value: "", label: "Todas" }, ...opcoes]

// Painel lateral de filtros do catálogo ("filtro aberto"). Só aplica ao clicar em "Aplicar filtros".
// As opções de categoria, técnica, material e região vêm de GET /filtros.
export function FilterPanel({ valores, onAplicar, onLimpar }: FilterPanelProps) {
  const [rascunho, setRascunho] = useState<FiltrosPainel>(valores)
  const { data: opcoes, loading, error, recarregar } = useApi(() => produtosService.opcoesFiltro(), [])
  const alterar = (campo: keyof FiltrosPainel) => (valor: string) => setRascunho((r) => ({ ...r, [campo]: valor || undefined }))

  return (
    <SectionCard title="Filtros" w={{ base: "full", lg: "300px" }} flexShrink={0} alignSelf="flex-start">
      <DataState loading={loading} error={error} onRetry={recarregar}>
        {opcoes && (
          <Stack gap="5">
            <SelectField label="Categoria" options={comTodas(opcoes.categorias)} value={rascunho.categoria ?? ""} onChange={alterar("categoria")} />
            <SelectField label="Técnica" options={comTodas(opcoes.tecnicas)} value={rascunho.tecnica ?? ""} onChange={alterar("tecnica")} />
            <SelectField label="Material" options={comTodas(opcoes.materiais)} value={rascunho.material ?? ""} onChange={alterar("material")} />
            <SelectField label="Localização do artesão" options={comTodas(opcoes.regioes)} value={rascunho.regiao ?? ""} onChange={alterar("regiao")} />
            <HStack align="flex-start">
              <FormField label="Preço mín." type="number" min={0} placeholder="R$ 0" value={rascunho.precoMin ?? ""} onChange={(e) => alterar("precoMin")(e.target.value)} />
              <FormField label="Preço máx." type="number" min={0} placeholder="R$ 1000" value={rascunho.precoMax ?? ""} onChange={(e) => alterar("precoMax")(e.target.value)} />
            </HStack>
            <AppCheckbox checked={rascunho.disponivel === "sim"} onCheckedChange={(e) => alterar("disponivel")(e.checked ? "sim" : "")}>
              Somente pronta entrega
            </AppCheckbox>
            <Button variant="origem" onClick={() => onAplicar(rascunho)}>
              Aplicar filtros
            </Button>
            <Button variant="claro" onClick={() => { setRascunho({}); onLimpar() }}>
              Limpar filtros
            </Button>
          </Stack>
        )}
      </DataState>
    </SectionCard>
  )
}
