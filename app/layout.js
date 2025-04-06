import { Inter } from "next/font/google"
import "./globals.css"

// Puedes elegir entre varias fuentes como:
// - Inter (moderna y limpia)
// - Poppins (redondeada y moderna)
// - Montserrat (elegante)
// - Roboto (clásica)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
})

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}

