import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PhoneCall, MessageCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="mb-8">
          <Image
            src="/images/logo.png"
            alt="Colegio Gimnasio Latinoamericano"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-secondary">
          Colegio Gimnasio Latinoamericano
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-[700px]">
          Formando líderes del mañana con educación de calidad y valores sólidos.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Iniciar Sesión
            </Button>
          </Link>
          <a href="https://wa.me/573174032550" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contactar por WhatsApp
            </Button>
          </a>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-10 text-secondary">Nuestros Servicios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Bachillerato Acelerado</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Curse 2 grados en 10 meses con nuestro programa de bachillerato acelerado para estudiantes con
                necesidades especiales.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Ciclos Lectivos Especiales</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Programas educativos adaptados a diferentes ritmos de aprendizaje y situaciones particulares de nuestros
                estudiantes.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Educación Personalizada</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Atención individualizada para garantizar el éxito académico de cada uno de nuestros estudiantes.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-12 bg-muted rounded-lg p-8 mt-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-secondary">Información de Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Dirección</h3>
            <p>Barrio Alto Quirinal</p>
            <p>Neiva, Huila</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Contacto</h3>
            <p className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-green-600" />
              WhatsApp: 317 403 2550
            </p>
            <p className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-primary" />
              Teléfono: 862 7965
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
