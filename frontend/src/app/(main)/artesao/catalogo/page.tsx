import { Suspense } from "react"
import { ArtisanCatalogView } from "@/components/artesao/ArtisanCatalogView"
import { LoadingState } from "@/components/feedback/LoadingState"

export default function MeuCatalogoPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ArtisanCatalogView />
    </Suspense>
  )
}
