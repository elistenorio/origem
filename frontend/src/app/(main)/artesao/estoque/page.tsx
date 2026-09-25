import { Suspense } from "react"
import { StockView } from "@/components/artesao/StockView"
import { LoadingState } from "@/components/feedback/LoadingState"

export default function EstoquePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <StockView />
    </Suspense>
  )
}
