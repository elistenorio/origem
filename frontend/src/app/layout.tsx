import localFont from "next/font/local"
import { Provider } from "@/components/ui/provider"
import { SessionLoader } from "@/components/autenticacao/SessionLoader"

// Cada fonte vira uma variável CSS (--font-titulo / --font-corpo),
// que o tema do Chakra lê em src/theme/system.ts.
// As duas são fontes variáveis (um arquivo cobre todos os pesos) com licença livre (OFL).
// Atkinson Hyperlegible Next: feita para leitura fácil, inclusive por pessoas com baixa visão.
const fonteTitulo = localFont({
  src: "./fonts/BricolageGrotesque-variavel.woff2",
  weight: "200 800",
  variable: "--font-titulo",
})

const fonteCorpo = localFont({
  src: "./fonts/AtkinsonHyperlegibleNext-variavel.woff2",
  weight: "200 800",
  variable: "--font-corpo",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${fonteTitulo.variable} ${fonteCorpo.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Provider>
          <SessionLoader />
          {children}
        </Provider>
      </body>
    </html>
  )
}
