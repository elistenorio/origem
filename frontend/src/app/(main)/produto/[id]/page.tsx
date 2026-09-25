import { ProductDetailView } from "@/components/produto/ProductDetailView"

export default async function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductDetailView id={id} />
}
