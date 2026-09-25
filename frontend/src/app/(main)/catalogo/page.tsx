import { Suspense } from "react"
import { CatalogView } from "@/components/catalogo/CatalogView"
import { LoadingState } from "@/components/feedback/LoadingState"

// Suspense: a tela lê os filtros da URL (useSearchParams).
export default function CatalogoPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <CatalogView />
    </Suspense>
  )
}
