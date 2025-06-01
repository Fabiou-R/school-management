"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getStudentGradesBySubjectAndPeriod } from "@/lib/data"
import { redirect } from "next/navigation"

export default function StudentGradesPage() {
  const { user, loading } = useAuth()

  // Redirect if not student
  if (!loading && (!user || user.role !== "student")) {
    redirect("/login")
  }

  // Get student's grades organized by subject and period
  const studentGradesBySubject = user ? getStudentGradesBySubjectAndPeriod(user.id) : {}

  // Periodos disponibles
  const periods = ["1er Trimestre", "2do Trimestre", "3er Trimestre"]

  if (loading) {
    return <div className="container py-10">Cargando...</div>
  }

  return (
    <div className="container py-10 app-background">
      <h1 className="text-3xl font-bold mb-6">Mis Calificaciones</h1>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Calificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Materia</TableHead>
                {periods.map((period) => (
                  <TableHead key={period}>{period}</TableHead>
                ))}
                <TableHead>Promedio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.values(studentGradesBySubject).map((subjectData, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{subjectData.subjectName}</TableCell>
                  {periods.map((period) => (
                    <TableCell key={period}>
                      {subjectData.periods[period] ? (
                        <span
                          className={
                            subjectData.periods[period] >= 70
                              ? "text-green-600 font-medium"
                              : "text-red-600 font-medium"
                          }
                        >
                          {subjectData.periods[period]}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <span className={`font-bold ${subjectData.average >= 70 ? "text-green-600" : "text-red-600"}`}>
                      {subjectData.average}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
