import { SimpleGrid } from "@chakra-ui/react"
import { ProductCard } from "@/components/home/ProductCard"
import type { Product } from "@/types/product"

const produtos: Product[] = [
  {
    id: "p1",
    title: "Figura de barro",
    tags: ["Peça única", "Barro"],
    artisan: "Mestre Joãozinho",
    artisanId: "a1",
    city: "Tracunhaém",
    dimensions: "15 × 27 × 15cm",
    price: 167.9,
    imageUrl: "https://picsum.photos/seed/origem1/600/400",
  },
  {
    id: "p2",
    title: "Cesto de palha",
    tags: ["Palha"],
    artisan: "Dona Maria",
    artisanId: "a2",
    city: "Caruaru",
    dimensions: "30 × 30 × 20cm",
    price: 89,
    imageUrl: "https://picsum.photos/seed/origem2/600/400",
  },
  {
    id: "p3",
    title: "Prato pintado à mão",
    tags: ["Peça única", "Cerâmica"],
    artisan: "Seu Zé",
    artisanId: "a3",
    city: "Bezerros",
    dimensions: "25 × 25 × 3cm",
    price: 1250.9,
    imageUrl: "https://picsum.photos/seed/origem3/600/400",
  },
]

export default function HomePage() {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="6" p="6">
      {produtos.map((produto) => (
        <ProductCard key={produto.id} product={produto} />
      ))}
    </SimpleGrid>
  )
}