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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { addParceladorTema, deleteParceladorTema, getTeachers, parceladorTemas, subjects } from "@/lib/data"
import { redirect } from "next/navigation"
import { PlusCircle, Trash2, Edit, Search, FileText } from "lucide-react"

export default function ParceladorPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [temaToDelete, setTemaToDelete] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrado, setSelectedGrado] = useState<number | null>(null)
  const [selectedGrupo, setSelectedGrupo] = useState<string | null>(null)
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null)
  const [temasList, setTemasList] = useState([...parceladorTemas])
  const [currentTema, setCurrentTema] = useState<any>(null)
  const [newTema, setNewTema] = useState({
    titulo: "",
    descripcion: "",
    objetivos: "",
    contenido: "",
    actividades: "",
    recursos: "",
    evaluacion: "",
    fechaInicio: new Date().toISOString().split("T")[0],
    fechaFin: new Date().toISOString().split("T")[0],
    materiaId: "",
    profesorId: "",
    grado: 1,
    grupo: "A",
  })

  const teachers = getTeachers()

  // Redirect if not admin
  if (!loading && (!user || user.role !== "admin")) {
    redirect("/login")
  }

  // Filtrar temas según los criterios de búsqueda
  const filteredTemas = temasList.filter((tema) => {
    let matchesSearch = true
    let matchesGrado = true
    let matchesGrupo = true
    let matchesMateria = true

    // Filtrar por término de búsqueda
    if (searchTerm) {
      matchesSearch =
        tema.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tema.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    }

    // Filtrar por grado
    if (selectedGrado !== null) {
      matchesGrado = tema.grado === selectedGrado
    }

    // Filtrar por grupo
    if (selectedGrupo !== null) {
      matchesGrupo = tema.grupo === selectedGrupo
    }

    // Filtrar por materia
    if (selectedMateria !== null) {
      matchesMateria = tema.materiaId === selectedMateria
    }

    return matchesSearch && matchesGrado && matchesGrupo && matchesMateria
  })

  const handleCreateTema = () => {
    if (!newTema.titulo || !newTema.materiaId || !newTema.profesorId) {
      toast({
        title: "Error",
        description: "Los campos título, materia y profesor son obligatorios",
        variant: "destructive",
      })
      return
    }

    try {
      const createdTema = addParceladorTema(newTema)

      // Actualizar el estado con una copia fresca del array global
      setTemasList([...parceladorTemas])

      toast({
        title: "Tema creado",
        description: `El tema "${createdTema.titulo}" ha sido añadido correctamente`,
      })

      setNewTema({
        titulo: "",
        descripcion: "",
        objetivos: "",
        contenido: "",
        actividades: "",
        recursos: "",
        evaluacion: "",
        fechaInicio: new Date().toISOString().split("T")[0],
        fechaFin: new Date().toISOString().split("T")[0],
        materiaId: "",
        profesorId: "",
        grado: 1,
        grupo: "A",
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el tema",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTema = () => {
    if (!temaToDelete) return

    try {
      const success = deleteParceladorTema(temaToDelete)

      if (success) {
        // Actualizar el estado con una copia fresca del array global
        setTemasList([...parceladorTemas])

        toast({
          title: "Tema eliminado",
          description: "El tema ha sido eliminado correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar el tema",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el tema",
        variant: "destructive",
      })
    } finally {
      setTemaToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const openDeleteDialog = (id: string) => {
    setTemaToDelete(id)
    setDeleteDialogOpen(true)
  }

  const openViewDialog = (tema: any) => {
    setCurrentTema(tema)
    setViewOpen(true)
  }

  const openEditDialog = (tema: any) => {
    setCurrentTema(tema)
    setEditOpen(true)
  }

  if (loading) {
    return <div className="container py-10">Cargando...</div>
  }

  return (
    <div className="container py-10 app-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary">Parcelador de Temas</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <PlusCircle className="h-4 w-4" />
              Nuevo Tema
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Tema</DialogTitle>
              <DialogDescription>
                Añade un nuevo tema al parcelador. Los campos con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={newTema.titulo}
                  onChange={(e) => setNewTema({ ...newTema, titulo: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={newTema.descripcion}
                  onChange={(e) => setNewTema({ ...newTema, descripcion: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="materia">Materia *</Label>
                  <Select
                    value={newTema.materiaId}
                    onValueChange={(value) => setNewTema({ ...newTema, materiaId: value })}
                  >
                    <SelectTrigger id="materia">
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
                  <Label htmlFor="profesor">Profesor *</Label>
                  <Select
                    value={newTema.profesorId}
                    onValueChange={(value) => setNewTema({ ...newTema, profesorId: value })}
                  >
                    <SelectTrigger id="profesor">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="grado">Grado</Label>
                  <Select
                    value={String(newTema.grado)}
                    onValueChange={(value) => setNewTema({ ...newTema, grado: Number.parseInt(value) })}
                  >
                    <SelectTrigger id="grado">
                      <SelectValue placeholder="Seleccionar grado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grupo">Grupo</Label>
                  <Select value={newTema.grupo} onValueChange={(value) => setNewTema({ ...newTema, grupo: value })}>
                    <SelectTrigger id="grupo">
                      <SelectValue placeholder="Seleccionar grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fechas">Fechas</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="fechaInicio" className="text-xs">
                        Inicio
                      </Label>
                      <Input
                        id="fechaInicio"
                        type="date"
                        value={newTema.fechaInicio}
                        onChange={(e) => setNewTema({ ...newTema, fechaInicio: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fechaFin" className="text-xs">
                        Fin
                      </Label>
                      <Input
                        id="fechaFin"
                        type="date"
                        value={newTema.fechaFin}
                        onChange={(e) => setNewTema({ ...newTema, fechaFin: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="objetivos">Objetivos</Label>
                <Textarea
                  id="objetivos"
                  value={newTema.objetivos}
                  onChange={(e) => setNewTema({ ...newTema, objetivos: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contenido">Contenido</Label>
                <Textarea
                  id="contenido"
                  value={newTema.contenido}
                  onChange={(e) => setNewTema({ ...newTema, contenido: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="actividades">Actividades</Label>
                <Textarea
                  id="actividades"
                  value={newTema.actividades}
                  onChange={(e) => setNewTema({ ...newTema, actividades: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="recursos">Recursos</Label>
                <Textarea
                  id="recursos"
                  value={newTema.recursos}
                  onChange={(e) => setNewTema({ ...newTema, recursos: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="evaluacion">Evaluación</Label>
                <Textarea
                  id="evaluacion"
                  value={newTema.evaluacion}
                  onChange={(e) => setNewTema({ ...newTema, evaluacion: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTema} className="bg-primary hover:bg-primary/90">
                Crear Tema
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el tema del parcelador.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTema} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-primary">{currentTema?.titulo}</DialogTitle>
            <DialogDescription>{currentTema?.descripcion}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold text-secondary">Materia:</span>{" "}
                {subjects.find((s) => s.id === currentTema?.materiaId)?.name}
              </div>
              <div>
                <span className="font-semibold text-secondary">Profesor:</span>{" "}
                {teachers.find((t) => t.id === currentTema?.profesorId)?.name}
              </div>
              <div>
                <span className="font-semibold text-secondary">Grado/Grupo:</span> {currentTema?.grado}º
                {currentTema?.grupo}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-secondary">Fecha Inicio:</span>{" "}
                {new Date(currentTema?.fechaInicio).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold text-secondary">Fecha Fin:</span>{" "}
                {new Date(currentTema?.fechaFin).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-secondary mb-2">Objetivos:</h3>
              <p className="whitespace-pre-line">{currentTema?.objetivos}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary mb-2">Contenido:</h3>
              <p className="whitespace-pre-line">{currentTema?.contenido}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary mb-2">Actividades:</h3>
              <p className="whitespace-pre-line">{currentTema?.actividades}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary mb-2">Recursos:</h3>
              <p className="whitespace-pre-line">{currentTema?.recursos}</p>
            </div>
            <div>
              <h3 className="font-semibold text-secondary mb-2">Evaluación:</h3>
              <p className="whitespace-pre-line">{currentTema?.evaluacion}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setViewOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar Temas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-1/5">
              <Label htmlFor="grado-filter">Grado</Label>
              <Select
                value={selectedGrado !== null ? String(selectedGrado) : ""}
                onValueChange={(value) => setSelectedGrado(value ? Number.parseInt(value) : null)}
              >
                <SelectTrigger id="grado-filter">
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
            <div className="w-full md:w-1/5">
              <Label htmlFor="grupo-filter">Grupo</Label>
              <Select
                value={selectedGrupo !== null ? selectedGrupo : ""}
                onValueChange={(value) => setSelectedGrupo(value || null)}
              >
                <SelectTrigger id="grupo-filter">
                  <SelectValue placeholder="Todos los grupos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos los grupos</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/5">
              <Label htmlFor="materia-filter">Materia</Label>
              <Select
                value={selectedMateria !== null ? selectedMateria : ""}
                onValueChange={(value) => setSelectedMateria(value || null)}
              >
                <SelectTrigger id="materia-filter">
                  <SelectValue placeholder="Todas las materias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todas las materias</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-2/5">
              <Label htmlFor="search">Buscar Tema</Label>
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por título o descripción..."
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
          <CardTitle>Temas del Parcelador</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Materia</TableHead>
                <TableHead>Profesor</TableHead>
                <TableHead>Grado/Grupo</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead className="w-[120px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemas.map((tema) => {
                const subject = subjects.find((s) => s.id === tema.materiaId)
                const teacher = teachers.find((t) => t.id === tema.profesorId)

                return (
                  <TableRow key={tema.id}>
                    <TableCell className="font-medium">{tema.titulo}</TableCell>
                    <TableCell>{subject?.name || "Desconocido"}</TableCell>
                    <TableCell>{teacher?.name || "Desconocido"}</TableCell>
                    <TableCell>
                      {tema.grado}º{tema.grupo}
                    </TableCell>
                    <TableCell>
                      {new Date(tema.fechaInicio).toLocaleDateString()} - {new Date(tema.fechaFin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openViewDialog(tema)}
                          className="text-secondary hover:text-secondary hover:bg-secondary/10"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Ver tema</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(tema)}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar tema</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(tema.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar tema</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredTemas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No se encontraron temas para los filtros seleccionados
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
