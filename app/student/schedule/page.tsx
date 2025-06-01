"use client"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getScheduleByGradeAndGroup, getTeachers, subjects } from "@/lib/data"
import { redirect } from "next/navigation"

export default function StudentSchedulePage() {
  const { user, loading } = useAuth()

  // Redirect if not student
  if (!loading && (!user || user.role !== "student")) {
    redirect("/login")
  }

  const teachers = getTeachers()

  // Obtener el horario del estudiante
  const studentSchedule = user && user.grade && user.group ? getScheduleByGradeAndGroup(user.grade, user.group) : []

  const getDayName = (day: number) => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
    return days[day]
  }

  // Función para obtener el horario según el timeSlot
  const getTimeSlotHour = (timeSlot: number) => {
    switch (timeSlot) {
      case 1:
        return "6:00-6:45"
      case 2:
        return "6:45-7:30"
      case 3:
        return "7:30-8:15"
      case 4:
        return "8:15-9:00"
      case 5:
        return "9:00-9:45"
      case 6:
        return "10:15-11:00"
      case 7:
        return "11:00-11:45"
      case 8:
        return "11:45-12:30"
      default:
        return `${timeSlot}ª hora`
    }
  }

  if (loading) {
    return <div className="container py-10">Cargando...</div>
  }

  return (
    <div className="container py-10 app-background">
      <h1 className="text-3xl font-bold mb-6">Mi Horario</h1>

      <Card>
        <CardHeader>
          <CardTitle>
            Horario para {user?.grade} - Grupo {user?.group}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Día</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Profesor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentSchedule.map((schedule) => {
                const subject = subjects.find((s) => s.id === schedule.subjectId)
                const teacher = teachers.find((t) => t.id === schedule.teacherId)

                return (
                  <TableRow key={schedule.id}>
                    <TableCell>{getDayName(schedule.dayOfWeek)}</TableCell>
                    <TableCell>{`${schedule.timeSlot}ª hora (${getTimeSlotHour(schedule.timeSlot)})`}</TableCell>
                    <TableCell>{subject?.name || "Desconocido"}</TableCell>
                    <TableCell>{teacher?.name || "Desconocido"}</TableCell>
                  </TableRow>
                )
              })}
              {studentSchedule.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No hay clases programadas para tu grado y grupo
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
