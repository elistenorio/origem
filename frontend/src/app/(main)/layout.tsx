import { TopNav } from "@/components/layout/TopNav"
import { Header } from "@/components/layout/Header"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <Header />
      <main>{children}</main>
      {/* <Footer /> entra aqui */}
    </>
  )
}