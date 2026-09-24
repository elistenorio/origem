// Perfil PÚBLICO do artesão (o que o comprador vê).
// O formulário de cadastro fica em types/artisan-registration.ts.
export type Artisan = {
  id: string
  name: string
  city: string
  region: string
  bio: string
  avatarUrl: string
  techniques: string[]
  productCount: number
}
