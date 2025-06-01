import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Colegio Gimnasio Latinoamericano - Sistema de Gestión Escolar",
  description:
    "Sistema de gestión para el Colegio Gimnasio Latinoamericano con roles de administrador, profesor y estudiante",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}
