"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { subjects, grades, getStudents } from "@/lib/data"
import { redirect } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function TeacherDashboard() {
  const { user, loading } = useAuth()

  // Redirect if not teacher
  if (!loading && (!user || user.role !== "teacher")) {
    redirect("/login")
  }

  // Get teacher's grades
  const teacherGrades = user ? grades.filter((grade) => grade.teacherId === user.id) : []

  // Count students
  const students = getStudents()

  // Average grades by subject for this teacher
  const averageGradesBySubject = subjects
    .map((subject) => {
      const subjectGrades = teacherGrades.filter((grade) => grade.subjectId === subject.id)
      const average =
        subjectGrades.length > 0 ? subjectGrades.reduce((sum, grade) => sum + grade.value, 0) / subjectGrades.length : 0

      return {
        name: subject.name,
        average: Math.round(average * 10) / 10,
      }
    })
    .filter((item) => item.average > 0)

  if (loading) {
    return <div className="container py-10">Cargando...</div>
  }

  return (
    <div className="container py-10 app-background">
      <h1 className="text-3xl font-bold mb-6">Panel de Profesor</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total de Estudiantes</CardTitle>
            <CardDescription>Estudiantes en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{students.length}</div>
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
            <CardTitle>Calificaciones Asignadas</CardTitle>
            <CardDescription>Por este profesor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{teacherGrades.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Promedio por Materia</CardTitle>
          <CardDescription>Calificaciones asignadas por ti</CardDescription>
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
  )
}
