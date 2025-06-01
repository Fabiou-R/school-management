"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = user ? [] : [{ name: "Inicio", href: "/" }]

  // Add role-specific nav items
  if (user) {
    if (user.role === "admin") {
      navItems.push(
        { name: "Dashboard", href: "/admin/dashboard" },
        { name: "Usuarios", href: "/admin/users" },
        { name: "Profesores", href: "/admin/teachers" },
        { name: "Materias", href: "/admin/subjects" },
        { name: "Calificaciones", href: "/admin/grades" },
        { name: "Horarios", href: "/admin/schedule" },
        { name: "Parcelador", href: "/admin/parcelador" },
      )
    } else if (user.role === "teacher") {
      navItems.push(
        { name: "Dashboard", href: "/teacher/dashboard" },
        { name: "Calificaciones", href: "/teacher/grades" },
        { name: "Horario", href: "/teacher/schedule" },
        { name: "Parcelador", href: "/teacher/parcelador" },
      )
    } else if (user.role === "student") {
      navItems.push(
        { name: "Dashboard", href: "/student/dashboard" },
        { name: "Mis Calificaciones", href: "/student/grades" },
        { name: "Mi Horario", href: "/student/schedule" },
      )
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {user && (
              <Image
                src="/images/logo.png"
                alt="Colegio Gimnasio Latinoamericano"
                width={40}
                height={40}
                className="mr-2"
              />
            )}
            <span className="font-bold text-xl text-secondary tracking-tight font-serif">
              Colegio Gimnasio Latinoamericano
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary font-bold" : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <Image
                src="/images/logo.png"
                alt="Colegio Gimnasio Latinoamericano"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="font-bold text-secondary tracking-tight font-serif">
                Colegio Gimnasio Latinoamericano
              </span>
            </Link>
            <nav className="mt-8 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-foreground/60 transition-colors hover:text-primary ${
                    isActive(item.href) ? "text-primary font-bold" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden md:inline-block">
                {user.name} (
                {user.role === "student" && user.grade && user.group
                  ? `${user.grade}º${user.group} - ${user.role}`
                  : user.role}
                )
              </span>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Cerrar sesión">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
