import { TopNav } from "@/components/layout/TopNav"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      {/* <Header /> entra aqui quando criarmos */}
      <main>{children}</main>
      {/* <Footer /> entra aqui */}
    </>
  )
}