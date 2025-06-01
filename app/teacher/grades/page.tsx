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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { addGrade, getStudentsByGradeAndGroup, getTeacherSubjects, grades, subjects } from "@/lib/data"
import { redirect } from "next/navigation"
import { PlusCircle, Edit, Search } from "lucide-react"

// Extender la función updateGrade para actualizar todos los campos
export function updateFullGrade(
  id: string,
  updates: { value?: number; subjectId?: string; period?: string; date?: string },
) {
  const gradeIndex = grades.findIndex((grade) => grade.id === id)
  if (gradeIndex !== -1) {
    grades[gradeIndex] = { ...grades[gradeIndex], ...updates }
    return grades[gradeIndex]
  }
  return undefined
}

export default function TeacherGradesPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [newGrade, setNewGrade] = useState({
    studentId: "",
    subjectId: "",
    value: 0,
    period: "1er Trimestre",
    date: new Date().toISOString().split("T")[0],
  })
  const [editGrade, setEditGrade] = useState({
    id: "",
    value: 0,
    subjectId: "",
    period: "",
    date: "",
  })
  const [gradesList, setGradesList] = useState([...grades])

  // Redirect if not teacher
  if (!loading && (!user || user.role !== "teacher")) {
    redirect("/login")
  }

  // Obtener las materias asignadas al profesor
  const teacherSubjects = user ? getTeacherSubjects(user.id) : []

  // Obtener estudiantes filtrados por grado y grupo
  const students = getStudentsByGradeAndGroup(selectedGrade || undefined, selectedGroup || undefined)

  // Filter grades for this teacher
  const teacherGrades = user ? gradesList.filter((grade) => grade.teacherId === user.id) : []

  // Filter students based on search term and selected grade/group
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter grades based on filtered students
  const filteredGrades = teacherGrades.filter((grade) => {
    // Primero filtrar por estudiante según el grado y grupo seleccionados
    const student = students.find((s) => s.id === grade.studentId)
    if (!student) return false

    // Luego aplicar el término de búsqueda si existe
    if (searchTerm) {
      return (
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return true
  })

  const handleCreateGrade = () => {
    if (!newGrade.studentId || !newGrade.subjectId || newGrade.value <= 0) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    if (newGrade.value < 0 || newGrade.value > 100) {
      toast({
        title: "Error",
        description: "La calificación debe estar entre 0 y 100",
        variant: "destructive",
      })
      return
    }

    try {
      const createdGrade = addGrade({
        studentId: newGrade.studentId,
        subjectId: newGrade.subjectId,
        teacherId: user!.id,
        value: newGrade.value,
        period: newGrade.period,
        date: newGrade.date,
      })

      // Actualizar el estado con una copia fresca del array global
      setGradesList([...grades])

      toast({
        title: "Calificación creada",
        description: "La calificación ha sido registrada correctamente",
      })

      setNewGrade({
        studentId: "",
        subjectId: "",
        value: 0,
        period: "1er Trimestre",
        date: new Date().toISOString().split("T")[0],
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la calificación",
        variant: "destructive",
      })
    }
  }

  const handleUpdateGrade = () => {
    if (editGrade.value < 0 || editGrade.value > 100) {
      toast({
        title: "Error",
        description: "La calificación debe estar entre 0 y 100",
        variant: "destructive",
      })
      return
    }

    try {
      const updated = updateFullGrade(editGrade.id, {
        value: editGrade.value,
        subjectId: editGrade.subjectId,
        period: editGrade.period,
        date: editGrade.date,
      })

      if (updated) {
        // Actualizar el estado con una copia fresca del array global
        setGradesList([...grades])

        toast({
          title: "Calificación actualizada",
          description: "La calificación ha sido actualizada correctamente",
        })

        setEditOpen(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la calificación",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (grade: (typeof grades)[0]) => {
    setEditGrade({
      id: grade.id,
      value: grade.value,
      subjectId: grade.subjectId,
      period: grade.period,
      date: grade.date,
    })
    setEditOpen(true)
  }

  if (loading) {
    return <div className="container py-10">Cargando...</div>
  }

  return (
    <div className="container py-10 app-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Calificaciones</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nueva Calificación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nueva Calificación</DialogTitle>
              <DialogDescription>Añade una nueva calificación para un estudiante.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="student">Estudiante</Label>
                <Select
                  value={newGrade.studentId}
                  onValueChange={(value) => setNewGrade({ ...newGrade, studentId: value })}
                >
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Seleccionar estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStudents.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.grade}
                        {student.group})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Materia</Label>
                <Select
                  value={newGrade.subjectId}
                  onValueChange={(value) => setNewGrade({ ...newGrade, subjectId: value })}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Seleccionar materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Calificación (0-100)</Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  max="100"
                  value={newGrade.value}
                  onChange={(e) => setNewGrade({ ...newGrade, value: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="period">Periodo</Label>
                <Select value={newGrade.period} onValueChange={(value) => setNewGrade({ ...newGrade, period: value })}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Seleccionar periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1er Trimestre">1er Trimestre</SelectItem>
                    <SelectItem value="2do Trimestre">2do Trimestre</SelectItem>
                    <SelectItem value="3er Trimestre">3er Trimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={newGrade.date}
                  onChange={(e) => setNewGrade({ ...newGrade, date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateGrade}>Registrar Calificación</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Calificación</DialogTitle>
              <DialogDescription>Modifica los datos de la calificación.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-subject">Materia</Label>
                <Select
                  value={editGrade.subjectId}
                  onValueChange={(value) => setEditGrade({ ...editGrade, subjectId: value })}
                >
                  <SelectTrigger id="edit-subject">
                    <SelectValue placeholder="Seleccionar materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-value">Calificación (0-100)</Label>
                <Input
                  id="edit-value"
                  type="number"
                  min="0"
                  max="100"
                  value={editGrade.value}
                  onChange={(e) => setEditGrade({ ...editGrade, value: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-period">Periodo</Label>
                <Select
                  value={editGrade.period}
                  onValueChange={(value) => setEditGrade({ ...editGrade, period: value })}
                >
                  <SelectTrigger id="edit-period">
                    <SelectValue placeholder="Seleccionar periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1er Trimestre">1er Trimestre</SelectItem>
                    <SelectItem value="2do Trimestre">2do Trimestre</SelectItem>
                    <SelectItem value="3er Trimestre">3er Trimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-date">Fecha</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editGrade.date}
                  onChange={(e) => setEditGrade({ ...editGrade, date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateGrade}>Actualizar Calificación</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar por Grado y Grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-1/4">
              <Label htmlFor="grade-filter">Grado</Label>
              <Select
                value={selectedGrade ? String(selectedGrade) : ""}
                onValueChange={(value) => setSelectedGrade(value ? Number.parseInt(value) : null)}
              >
                <SelectTrigger id="grade-filter">
                  <SelectValue placeholder="Todos los grados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos los grados</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <Label htmlFor="group-filter">Grupo</Label>
              <Select
                value={selectedGroup || ""}
                onValueChange={(value) => setSelectedGroup(value === "all" ? null : value)}
              >
                <SelectTrigger id="group-filter">
                  <SelectValue placeholder="Todos los grupos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grupos</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3">
              <Label htmlFor="search">Buscar Estudiante</Label>
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nombre o correo del estudiante..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calificaciones Asignadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Grado/Grupo</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Calificación</TableHead>
                <TableHead>Periodo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.map((grade) => {
                const student = filteredStudents.find((s) => s.id === grade.studentId)
                const subject = subjects.find((s) => s.id === grade.subjectId)

                return (
                  <TableRow key={grade.id}>
                    <TableCell>{student?.name || "Desconocido"}</TableCell>
                    <TableCell>{student ? `${student.grade}${student.group}` : "-"}</TableCell>
                    <TableCell>{subject?.name || "Desconocido"}</TableCell>
                    <TableCell>{grade.value}</TableCell>
                    <TableCell>{grade.period}</TableCell>
                    <TableCell>{grade.date}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(grade)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredGrades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No se encontraron calificaciones para los filtros seleccionados
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
