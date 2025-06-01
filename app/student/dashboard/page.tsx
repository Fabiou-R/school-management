"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStudentGrades, subjects } from "@/lib/data"
import { redirect } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function StudentDashboard() {
  const { user, loading } = useAuth()

  // Redirect if not student
  if (!loading && (!user || user.role !== "student")) {
    redirect("/login")
  }

  // Get student's grades
  const studentGrades = user ? getStudentGrades(user.id) : []

  // Calculate average grade
  const averageGrade =
    studentGrades.length > 0 ? studentGrades.reduce((sum, grade) => sum + grade.value, 0) / studentGrades.length : 0

  // Prepare data for chart
  const chartData = subjects.map((subject) => {
    const subjectGrade = studentGrades.find((grade) => grade.subject.id === subject.id)
    return {
      name: subject.name,
      calificación: subjectGrade ? subjectGrade.value : 0,
    }
  })

  if (loading) {
    return <div className="container py-10">Cargando...</div>
  }

  return (
    <div className="container py-10 app-background">
      <h1 className="text-3xl font-bold mb-6">Panel de Estudiante</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Promedio General</CardTitle>
            <CardDescription>Tu calificación promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{Math.round(averageGrade * 10) / 10}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total de Materias</CardTitle>
            <CardDescription>Materias cursadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{studentGrades.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Mejor Calificación</CardTitle>
            <CardDescription>Tu nota más alta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {studentGrades.length > 0 ? Math.max(...studentGrades.map((grade) => grade.value)) : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempeño por Materia</CardTitle>
          <CardDescription>Tus calificaciones en cada materia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData.filter((item) => item.calificación > 0)}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="calificación" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
