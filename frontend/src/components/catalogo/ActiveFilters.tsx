import { HStack } from "@chakra-ui/react"
import { FilterChip } from "@/components/common/FilterChip"
import { CATEGORIAS } from "@/constants/categorias"
import { TECNICAS } from "@/constants/tecnicas"
import { MATERIAIS } from "@/constants/materiais"
import { REGIOES } from "@/constants/regioes"
import { formatCurrency } from "@/utils/formatCurrency"

type Filtros = Record<string, string | undefined>

const listas: Record<string, { value: string; label: string }[]> = { categoria: CATEGORIAS, tecnica: TECNICAS, material: MATERIAIS, regiao: REGIOES }

function rotular(chave: string, valor: string) {
  if (chave === "busca") return `“${valor}”`
  if (chave === "precoMin") return `A partir de ${formatCurrency(Number(valor))}`
  if (chave === "precoMax") return `Até ${formatCurrency(Number(valor))}`
  if (chave === "disponivel") return "Pronta entrega"
  return listas[chave]?.find((o) => o.value === valor)?.label ?? valor
}

// Chips dos filtros aplicados; o "x" remove só aquele filtro.
export function ActiveFilters({ filtros, onRemover }: { filtros: Filtros; onRemover: (chave: string) => void }) {
  const ativos = Object.entries(filtros).filter(([chave, valor]) => valor && chave !== "ordenar")
  if (ativos.length === 0) return null
  return (
    <HStack gap="2" wrap="wrap">
      {ativos.map(([chave, valor]) => (
        <FilterChip key={chave} label={rotular(chave, valor!)} onRemove={() => onRemover(chave)} />
      ))}
    </HStack>
  )
}
