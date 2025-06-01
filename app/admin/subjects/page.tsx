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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { addSubject, deleteSubject, subjects } from "@/lib/data"
import { redirect } from "next/navigation"
import { PlusCircle, Trash2 } from "lucide-react"

export default function SubjectsPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subjectToDelete, setSubjectToDelete] = useState<string | null>(null)
  const [newSubject, setNewSubject] = useState({
    name: "",
    description: "",
  })
  const [subjectsList, setSubjectsList] = useState([...subjects])

  // Redirect if not admin
  if (!loading && (!user || user.role !== "admin")) {
    redirect("/login")
  }

  const handleCreateSubject = () => {
    if (!newSubject.name || !newSubject.description) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    try {
      // Añadir la materia al array global
      const createdSubject = addSubject({
        name: newSubject.name,
        description: newSubject.description,
      })

      // Actualizar el estado local con una copia fresca del array global
      setSubjectsList([...subjects])

      toast({
        title: "Materia creada",
        description: `${createdSubject.name} ha sido añadida`,
      })

      setNewSubject({
        name: "",
        description: "",
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la materia",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSubject = () => {
    if (!subjectToDelete) return

    try {
      const success = deleteSubject(subjectToDelete)

      if (success) {
        // Actualizar el estado local con una copia fresca del array global
        setSubjectsList([...subjects])

        toast({
          title: "Materia eliminada",
          description: "La materia ha sido eliminada correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: "No se puede eliminar la materia porque tiene calificaciones asociadas",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la materia",
        variant: "destructive",
      })
    } finally {
      setSubjectToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const openDeleteDialog = (id: string) => {
    setSubjectToDelete(id)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return <div className="container py-10">Cargando...</div>
  }

  return (
    <div className="container py-10 app-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Materias</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nueva Materia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Materia</DialogTitle>
              <DialogDescription>
                Añade una nueva materia al sistema. Todos los campos son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre de la Materia</Label>
                <Input
                  id="name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateSubject}>Crear Materia</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la materia del sistema.
              <br />
              <br />
              <strong>Nota:</strong> No se pueden eliminar materias que tengan calificaciones asociadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSubject} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Materias</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectsList.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.id}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(subject.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar materia</span>
                    </Button>
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
