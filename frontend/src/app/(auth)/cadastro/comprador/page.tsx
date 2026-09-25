import { AuthBackground } from "@/components/autenticacao/AuthBackground"
import { AuthCard } from "@/components/autenticacao/AuthCard"
import { BuyerRegisterForm } from "@/components/autenticacao/BuyerRegisterForm"

export default function CadastroCompradorPage() {
  return (
    <AuthBackground image="/images/bg-pre-register.png">
      <AuthCard title="Crie a sua conta">
        <BuyerRegisterForm />
      </AuthCard>
    </AuthBackground>
  )
}
