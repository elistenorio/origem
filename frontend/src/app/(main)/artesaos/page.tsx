import { Suspense } from "react"
import { ArtisansView } from "@/components/artesaos/ArtisansView"
import { LoadingState } from "@/components/feedback/LoadingState"

export default function ArtesaosPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ArtisansView />
    </Suspense>
  )
}
