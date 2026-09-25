import { ArtisanProfileView } from "@/components/artesaos/ArtisanProfileView"

export default async function ArtesaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ArtisanProfileView id={id} />
}
