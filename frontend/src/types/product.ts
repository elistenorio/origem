export type Product = {
  id: string
  title: string
  tags: string[]        // ex.: ["Peça única", "Barro"]
  artisan: string       // ex.: "Mestre Joãozinho"
  city: string          // ex.: "Tracunhaém"
  dimensions: string    // ex.: "15 × 27 × 15cm"
  price: number         // ex.: 167.9
  imageUrl: string
}