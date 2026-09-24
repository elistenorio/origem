import { TopNav } from "@/components/layout/TopNav"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}