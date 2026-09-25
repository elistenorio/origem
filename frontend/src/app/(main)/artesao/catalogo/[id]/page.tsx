import { EditProductView } from "@/components/artesao/EditProductView"

export default async function EditarPecaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <EditProductView id={id} />
}
