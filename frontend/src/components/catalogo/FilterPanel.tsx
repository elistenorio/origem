"use client"

import { useState } from "react"
import { Button, HStack, Stack } from "@chakra-ui/react"
import { Panel } from "@/components/common/Panel"
import { SelectField } from "@/components/common/SelectField"
import { FormField } from "@/components/common/FormField"
import { AppCheckbox } from "@/components/common/AppCheckbox"
import { CATEGORIAS } from "@/constants/categorias"
import { TECNICAS } from "@/constants/tecnicas"
import { MATERIAIS } from "@/constants/materiais"
import { REGIOES } from "@/constants/regioes"

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
export function FilterPanel({ valores, onAplicar, onLimpar }: FilterPanelProps) {
  const [rascunho, setRascunho] = useState<FiltrosPainel>(valores)
  const alterar = (campo: keyof FiltrosPainel) => (valor: string) => setRascunho((r) => ({ ...r, [campo]: valor || undefined }))

  return (
    <Panel title="Filtros" w={{ base: "full", lg: "300px" }} flexShrink={0} alignSelf="flex-start">
      <Stack gap="5">
        <SelectField label="Categoria" options={comTodas(CATEGORIAS)} value={rascunho.categoria ?? ""} onChange={alterar("categoria")} />
        <SelectField label="Técnica" options={comTodas(TECNICAS)} value={rascunho.tecnica ?? ""} onChange={alterar("tecnica")} />
        <SelectField label="Material" options={comTodas(MATERIAIS)} value={rascunho.material ?? ""} onChange={alterar("material")} />
        <SelectField label="Localização do artesão" options={comTodas(REGIOES)} value={rascunho.regiao ?? ""} onChange={alterar("regiao")} />
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
    </Panel>
  )
}
