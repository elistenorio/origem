import { AuthBackground } from "@/components/autenticacao/AuthBackground"
import { AuthCard } from "@/components/autenticacao/AuthCard"
import { LoginForm } from "@/components/autenticacao/LoginForm"

export default function LoginPage() {
  return (
    <AuthBackground image="/images/bg-login.png">
      <AuthCard title="Entrar na sua conta">
        <LoginForm />
      </AuthCard>
    </AuthBackground>
  )
}