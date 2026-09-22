import { Stack } from "@chakra-ui/react"
import { AuthBackground } from "@/components/auth/AuthBackground"
import { AuthCard } from "@/components/auth/AuthCard"
import { RoleOption } from "@/components/auth/RoleOption"

export default function PreRegisterPage() {
  return (
    <AuthBackground image="/images/bg-pre-register.png">
      <AuthCard title="Escolha como fazer parte:">
        <Stack gap="6">
          <RoleOption
            href="/cadastro/artesao"
            label="Sou"
            highlight="Artesão"
            description="Crie seu perfil, divulgue seu trabalho e venda suas peças."
          />
          <RoleOption
            href="/cadastro/comprador"
            label="Quero"
            highlight="Comprar"
            description="Crie sua conta para comprar peças e acompanhar seus pedidos."
          />
        </Stack>
      </AuthCard>
    </AuthBackground>
  )
}