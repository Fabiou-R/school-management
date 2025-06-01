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
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { getTeachers, getTeacherSubjects, subjects, updateTeacherSubjects } from "@/lib/data"
import { redirect } from "next/navigation"
import { Edit, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function TeachersPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [editOpen, setEditOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeacher, setSelectedTeacher] = useState<{
    id: string
    name: string
    subjectIds: string[]
  }>({
    id: "",
    name: "",
    subjectIds: [],
  })
  const [teachersList] = useState(getTeachers())

  // Redirect if not admin
  if (!loading && (!user || user.role !== "admin")) {
    redirect("/login")
  }

  // Filtrar profesores según el término de búsqueda
  const filteredTeachers = teachersList.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUpdateTeacherSubjects = () => {
    try {
      updateTeacherSubjects(selectedTeacher.id, selectedTeacher.subjectIds)

      toast({
        title: "Materias actualizadas",
        description: `Las materias de ${selectedTeacher.name} han sido actualizadas correctamente`,
      })

      setEditOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron actualizar las materias",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (teacherId: string, teacherName: string) => {
    const teacher = teachersList.find((t) => t.id === teacherId)
    if (!teacher) return

    setSelectedTeacher({
      id: teacherId,
      name: teacherName,
      subjectIds: teacher.subjects || [],
    })
    setEditOpen(true)
  }

  const toggleSubject = (subjectId: string) => {
    setSelectedTeacher((prev) => {
      const newSubjectIds = prev.subjectIds.includes(subjectId)
        ? prev.subjectIds.filter((id) => id !== subjectId)
        : [...prev.subjectIds, subjectId]

      return {
        ...prev,
        subjectIds: newSubjectIds,
      }
    })
  }

  if (loading) {
    return <div className="container py-10">Cargando...</div>
  }

  return (
    <div className="container py-10 app-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Asignación de Materias a Profesores</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Profesores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar profesores por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo Electrónico</TableHead>
                <TableHead>Materias Asignadas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => {
                const teacherSubjects = getTeacherSubjects(teacher.id)

                return (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.id}</TableCell>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      {teacherSubjects.length > 0
                        ? teacherSubjects.map((s) => s.name).join(", ")
                        : "Sin materias asignadas"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(teacher.id, teacher.name)}>
                        <Edit className="h-4 w-4" />
                        <span className="ml-2">Asignar Materias</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Materias a {selectedTeacher.name}</DialogTitle>
            <DialogDescription>Selecciona las materias que impartirá este profesor.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`subject-${subject.id}`}
                  checked={selectedTeacher.subjectIds.includes(subject.id)}
                  onCheckedChange={() => toggleSubject(subject.id)}
                />
                <Label htmlFor={`subject-${subject.id}`} className="flex-1">
                  {subject.name} - {subject.description}
                </Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateTeacherSubjects}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
