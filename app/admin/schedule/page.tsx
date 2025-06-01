"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { addSchedule, deleteSchedule, getTeachers, schedules, subjects } from "@/lib/data"
import { redirect } from "next/navigation"
import { PlusCircle, Trash2 } from "lucide-react"

export default function SchedulePage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<string>("Preescolar")
  const [selectedGroup, setSelectedGroup] = useState<string>("1")
  const [newSchedule, setNewSchedule] = useState({
    grade: "Preescolar",
    group: "1",
    dayOfWeek: 1,
    timeSlot: 1,
    subjectId: "",
    teacherId: "",
  })
  const [schedulesList, setSchedulesList] = useState([...schedules])
  const teachers = getTeachers()

  // Redirect if not admin
  if (!loading && (!user || user.role !== "admin")) {
    redirect("/login")
  }

  // Filtrar horarios por grado y grupo
  const filteredSchedules = schedulesList.filter(
    (schedule) => schedule.grade === selectedGrade && schedule.group === selectedGroup,
  )

  const handleCreateSchedule = () => {
    if (!newSchedule.subjectId || !newSchedule.teacherId) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    // Verificar si ya existe un horario para ese día y hora
    const existingSchedule = schedulesList.find(
      (s) =>
        s.grade === newSchedule.grade &&
        s.group === newSchedule.group &&
        s.dayOfWeek === newSchedule.dayOfWeek &&
        s.timeSlot === newSchedule.timeSlot,
    )

    if (existingSchedule) {
      toast({
        title: "Error",
        description: "Ya existe una clase programada para este día y hora",
        variant: "destructive",
      })
      return
    }

    try {
      const createdSchedule = addSchedule(newSchedule)

      // Actualizar el estado local con una copia fresca del array global
      setSchedulesList([...schedules])

      toast({
        title: "Horario creado",
        description: "La clase ha sido programada correctamente",
      })

      setNewSchedule({
        grade: selectedGrade,
        group: selectedGroup,
        dayOfWeek: 1,
        timeSlot: 1,
        subjectId: "",
        teacherId: "",
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el horario",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSchedule = () => {
    if (!scheduleToDelete) return

    try {
      const success = deleteSchedule(scheduleToDelete)

      if (success) {
        // Actualizar el estado local con una copia fresca del array global
        setSchedulesList([...schedules])

        toast({
          title: "Horario eliminado",
          description: "La clase ha sido eliminada del horario",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar la clase del horario",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la clase del horario",
        variant: "destructive",
      })
    } finally {
      setScheduleToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const openDeleteDialog = (id: string) => {
    setScheduleToDelete(id)
    setDeleteDialogOpen(true)
  }

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Horarios</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nueva Clase
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Programar Nueva Clase</DialogTitle>
              <DialogDescription>
                Añade una nueva clase al horario. Todos los campos son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grado</Label>
                  <Select
                    value={newSchedule.grade}
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, grade: value })}
                  >
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Seleccionar grado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Preescolar">Preescolar</SelectItem>
                      <SelectItem value="1°">1° Primaria</SelectItem>
                      <SelectItem value="2°">2° Primaria</SelectItem>
                      <SelectItem value="3°">3° Primaria</SelectItem>
                      <SelectItem value="4°">4° Primaria</SelectItem>
                      <SelectItem value="5°">5° Primaria</SelectItem>
                      <SelectItem value="6°">6° Secundaria</SelectItem>
                      <SelectItem value="7°">7° Secundaria</SelectItem>
                      <SelectItem value="8°">8° Secundaria</SelectItem>
                      <SelectItem value="9°">9° Secundaria</SelectItem>
                      <SelectItem value="10°">10° Media</SelectItem>
                      <SelectItem value="11°">11° Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="group">Grupo</Label>
                  <Select
                    value={newSchedule.group}
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, group: value })}
                  >
                    <SelectTrigger id="group">
                      <SelectValue placeholder="Seleccionar grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Grupo 1</SelectItem>
                      <SelectItem value="2">Grupo 2</SelectItem>
                      <SelectItem value="3">Grupo 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dayOfWeek">Día</Label>
                  <Select
                    value={String(newSchedule.dayOfWeek)}
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, dayOfWeek: Number.parseInt(value) })}
                  >
                    <SelectTrigger id="dayOfWeek">
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Lunes</SelectItem>
                      <SelectItem value="2">Martes</SelectItem>
                      <SelectItem value="3">Miércoles</SelectItem>
                      <SelectItem value="4">Jueves</SelectItem>
                      <SelectItem value="5">Viernes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timeSlot">Hora</Label>
                  <Select
                    value={String(newSchedule.timeSlot)}
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, timeSlot: Number.parseInt(value) })}
                  >
                    <SelectTrigger id="timeSlot">
                      <SelectValue placeholder="Seleccionar hora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1ª hora (6:00-6:45)</SelectItem>
                      <SelectItem value="2">2ª hora (6:45-7:30)</SelectItem>
                      <SelectItem value="3">3ª hora (7:30-8:15)</SelectItem>
                      <SelectItem value="4">4ª hora (8:15-9:00)</SelectItem>
                      <SelectItem value="5">5ª hora (9:00-9:45)</SelectItem>
                      <SelectItem value="6">6ª hora (10:15-11:00)</SelectItem>
                      <SelectItem value="7">7ª hora (11:00-11:45)</SelectItem>
                      <SelectItem value="8">8ª hora (11:45-12:30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Materia</Label>
                <Select
                  value={newSchedule.subjectId}
                  onValueChange={(value) => setNewSchedule({ ...newSchedule, subjectId: value })}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Seleccionar materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacher">Profesor</Label>
                <Select
                  value={newSchedule.teacherId}
                  onValueChange={(value) => setNewSchedule({ ...newSchedule, teacherId: value })}
                >
                  <SelectTrigger id="teacher">
                    <SelectValue placeholder="Seleccionar profesor" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateSchedule}>Crear Horario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la clase del horario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSchedule} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seleccionar Grado y Grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-1/4">
              <Label htmlFor="grade-filter">Grado</Label>
              <Select
                value={selectedGrade}
                onValueChange={(value) => {
                  setSelectedGrade(value)
                  setNewSchedule((prev) => ({ ...prev, grade: value }))
                }}
              >
                <SelectTrigger id="grade-filter">
                  <SelectValue placeholder="Seleccionar grado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preescolar">Preescolar</SelectItem>
                  <SelectItem value="1°">1° Primaria</SelectItem>
                  <SelectItem value="2°">2° Primaria</SelectItem>
                  <SelectItem value="3°">3° Primaria</SelectItem>
                  <SelectItem value="4°">4° Primaria</SelectItem>
                  <SelectItem value="5°">5° Primaria</SelectItem>
                  <SelectItem value="6°">6° Secundaria</SelectItem>
                  <SelectItem value="7°">7° Secundaria</SelectItem>
                  <SelectItem value="8°">8° Secundaria</SelectItem>
                  <SelectItem value="9°">9° Secundaria</SelectItem>
                  <SelectItem value="10°">10° Media</SelectItem>
                  <SelectItem value="11°">11° Media</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <Label htmlFor="group-filter">Grupo</Label>
              <Select
                value={selectedGroup}
                onValueChange={(value) => {
                  setSelectedGroup(value)
                  setNewSchedule((prev) => ({ ...prev, group: value }))
                }}
              >
                <SelectTrigger id="group-filter">
                  <SelectValue placeholder="Seleccionar grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Grupo 1</SelectItem>
                  <SelectItem value="2">Grupo 2</SelectItem>
                  <SelectItem value="3">Grupo 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Horario para {selectedGrade} - Grupo {selectedGroup}
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
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => {
                const subject = subjects.find((s) => s.id === schedule.subjectId)
                const teacher = teachers.find((t) => t.id === schedule.teacherId)

                return (
                  <TableRow key={schedule.id}>
                    <TableCell>{getDayName(schedule.dayOfWeek)}</TableCell>
                    <TableCell>{`${schedule.timeSlot}ª hora (${getTimeSlotHour(schedule.timeSlot)})`}</TableCell>
                    <TableCell>{subject?.name || "Desconocido"}</TableCell>
                    <TableCell>{teacher?.name || "Desconocido"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(schedule.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar clase</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredSchedules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No hay clases programadas para este grado y grupo
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
