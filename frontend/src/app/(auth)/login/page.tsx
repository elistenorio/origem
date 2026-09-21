import { AuthBackground } from "@/components/auth/AuthBackground"
import { AuthCard } from "@/components/auth/AuthCard"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <AuthBackground image="/images/bg-login.png">
      <AuthCard title="Entrar na sua conta">
        <LoginForm />
      </AuthCard>
    </AuthBackground>
  )
}