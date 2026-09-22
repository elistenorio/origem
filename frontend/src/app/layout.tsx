import localFont from "next/font/local"
import { Provider } from "@/components/ui/provider"

// Cada fonte vira uma variável CSS (--font-titulo / --font-corpo),
// que o tema do Chakra lê em src/theme/system.ts
const fonteTitulo = localFont({
  src: "./fonts/TradeGothicNext-HeavyCondensed.otf",
  variable: "--font-titulo",
})

const fonteCorpo = localFont({
  src: [
    { path: "./fonts/BrandonGrotesque-Regular.otf", weight: "400" },
    { path: "./fonts/BrandonGrotesque-Bold.otf", weight: "700" },
  ],
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
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
