import { AuthBackground } from "@/components/auth/AuthBackground"
import { AuthCard } from "@/components/auth/AuthCard"
import { BuyerRegisterForm } from "@/components/auth/BuyerRegisterForm"

export default function CadastroCompradorPage() {
  return (
    <AuthBackground image="/images/bg-pre-register.png">
      <AuthCard title="Crie a sua conta">
        <BuyerRegisterForm />
      </AuthCard>
    </AuthBackground>
  )
}
