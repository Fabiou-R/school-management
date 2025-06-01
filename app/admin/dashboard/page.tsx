"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { subjects, users, grades } from "@/lib/data"
import { redirect } from "next/navigation"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

export default function AdminDashboard() {
  const { user, loading } = useAuth()

  // Redirect if not admin
  if (!loading && (!user || user.role !== "admin")) {
    redirect("/login")
  }

  // Count users by role
  const usersByRole = [
    { name: "Administradores", value: users.filter((u) => u.role === "admin").length },
    { name: "Profesores", value: users.filter((u) => u.role === "teacher").length },
    { name: "Estudiantes", value: users.filter((u) => u.role === "student").length },
  ]

  // Average grades by subject
  const averageGradesBySubject = subjects.map((subject) => {
    const subjectGrades = grades.filter((grade) => grade.subjectId === subject.id)
    const average =
      subjectGrades.length > 0 ? subjectGrades.reduce((sum, grade) => sum + grade.value, 0) / subjectGrades.length : 0

    return {
      name: subject.name,
      average: Math.round(average * 10) / 10,
    }
  })

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

  if (loading) {
    return <div className="container py-10">Cargando...</div>
  }

  return (
    <div className="container py-10 app-background">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total de Usuarios</CardTitle>
            <CardDescription>Usuarios registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total de Materias</CardTitle>
            <CardDescription>Materias disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{subjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total de Calificaciones</CardTitle>
            <CardDescription>Calificaciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{grades.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Distribución de Usuarios</CardTitle>
            <CardDescription>Por tipo de rol</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByRole}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {usersByRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Promedio por Materia</CardTitle>
            <CardDescription>Calificación promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={averageGradesBySubject}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#8884d8" name="Promedio" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
