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
import { useToast } from "@/components/ui/use-toast"
import { addUser, deleteUser, updateUser, users } from "@/lib/data"
import { redirect } from "next/navigation"
import { PlusCircle, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react"

export default function UsersPage() {
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as "admin" | "teacher" | "student",
    grade: "Preescolar",
    group: "1",
  })
  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "student" as "admin" | "teacher" | "student",
    grade: "Preescolar",
    group: "1",
  })
  const [usersList, setUsersList] = useState([...users])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [gradeFilter, setGradeFilter] = useState<string | null>(null)
  const [groupFilter, setGroupFilter] = useState<string | null>(null)

  // Redirect if not admin
  if (!loading && (!user || user.role !== "admin")) {
    redirect("/login")
  }

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    try {
      // Preparar el usuario según su rol
      const userToCreate = { ...newUser }

      // Solo incluir grado y grupo si es estudiante
      if (userToCreate.role !== "student") {
        delete userToCreate.grade
        delete userToCreate.group
      }

      // Si es profesor, inicializar con array de materias vacío
      if (userToCreate.role === "teacher") {
        userToCreate.subjects = []
      }

      const createdUser = addUser(userToCreate)

      // Actualizar el estado con una copia fresca del array global
      setUsersList([...users])

      toast({
        title: "Usuario creado",
        description: `${createdUser.name} ha sido añadido como ${createdUser.role}`,
      })

      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "student",
        grade: "Preescolar",
        group: "1",
      })

      setCreateOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el usuario",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = () => {
    if (!editUser.name || !editUser.email) {
      toast({
        title: "Error",
        description: "Nombre y correo electrónico son obligatorios",
        variant: "destructive",
      })
      return
    }

    try {
      // Preparar el usuario según su rol
      const userToUpdate: any = {
        id: editUser.id,
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
      }

      // Actualizar contraseña solo si se proporcionó una nueva
      if (editUser.password) {
        userToUpdate.password = editUser.password
      }

      // Solo incluir grado y grupo si es estudiante
      if (editUser.role === "student") {
        userToUpdate.grade = editUser.grade
        userToUpdate.group = editUser.group
      }

      // Si es profesor, mantener las materias asignadas
      if (editUser.role === "teacher") {
        const existingUser = users.find((u) => u.id === editUser.id)
        if (existingUser && existingUser.subjects) {
          userToUpdate.subjects = existingUser.subjects
        } else {
          userToUpdate.subjects = []
        }
      }

      const updatedUser = updateUser(userToUpdate)

      if (updatedUser) {
        // Actualizar el estado con una copia fresca del array global
        setUsersList([...users])

        toast({
          title: "Usuario actualizado",
          description: `${updatedUser.name} ha sido actualizado correctamente`,
        })

        setEditOpen(false)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = () => {
    if (!userToDelete) return

    try {
      const success = deleteUser(userToDelete)

      if (success) {
        // Actualizar el estado con una copia fresca del array global
        setUsersList([...users])

        toast({
          title: "Usuario eliminado",
          description: "El usuario ha sido eliminado correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: "No se puede eliminar este usuario porque tiene datos asociados",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      })
    } finally {
      setUserToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (userId: string) => {
    const userToEdit = users.find((u) => u.id === userId)
    if (!userToEdit) return

    setEditUser({
      id: userToEdit.id,
      name: userToEdit.name,
      email: userToEdit.email,
      password: "", // No mostrar la contraseña actual por seguridad
      role: userToEdit.role,
      grade: userToEdit.grade || "Preescolar",
      group: userToEdit.group || "1",
    })

    setEditOpen(true)
  }

  const openDeleteDialog = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  // Filtrar usuarios según los criterios
  const filteredUsers = usersList.filter((u) => {
    const searchLower = searchTerm.toLowerCase()
    let matchesSearch = true
    let matchesRole = true
    let matchesGrade = true
    let matchesGroup = true

    // Filtrar por término de búsqueda
    if (searchTerm) {
      matchesSearch =
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.role.toLowerCase().includes(searchLower) ||
        (u.role === "student" && u.grade && u.group && `${u.grade} ${u.group}`.toLowerCase().includes(searchLower))
    }

    // Filtrar por rol
    if (roleFilter) {
      matchesRole = u.role === roleFilter
    }

    // Filtrar por grado (solo para estudiantes)
    if (gradeFilter !== null) {
      matchesGrade = u.role === "student" && u.grade === gradeFilter
    }

    // Filtrar por grupo (solo para estudiantes)
    if (groupFilter) {
      matchesGroup = u.role === "student" && u.group === groupFilter
    }

    return matchesSearch && matchesRole && matchesGrade && matchesGroup
  })

  if (loading) {
    return <div className="container py-10">Cargando...</div>
  }

  return (
    <div className="container py-10 app-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Añade un nuevo usuario al sistema. Todos los campos son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "admin" | "teacher" | "student") => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="teacher">Profesor</SelectItem>
                    <SelectItem value="student">Estudiante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campos adicionales solo para estudiantes */}
              {newUser.role === "student" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="grade">Grado</Label>
                    <Select value={newUser.grade} onValueChange={(value) => setNewUser({ ...newUser, grade: value })}>
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
                    <Select value={newUser.group} onValueChange={(value) => setNewUser({ ...newUser, group: value })}>
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
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser}>Crear Usuario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Diálogo de edición */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica los datos del usuario. Deja la contraseña en blanco para mantener la actual.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nombre Completo</Label>
              <Input
                id="edit-name"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Correo Electrónico</Label>
              <Input
                id="edit-email"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Nueva Contraseña (opcional)</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showPassword ? "text" : "password"}
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  placeholder="Dejar en blanco para mantener la actual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">Rol</Label>
              <Select
                value={editUser.role}
                onValueChange={(value: "admin" | "teacher" | "student") => setEditUser({ ...editUser, role: value })}
              >
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="teacher">Profesor</SelectItem>
                  <SelectItem value="student">Estudiante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campos adicionales solo para estudiantes */}
            {editUser.role === "student" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="edit-grade">Grado</Label>
                  <Select value={editUser.grade} onValueChange={(value) => setEditUser({ ...editUser, grade: value })}>
                    <SelectTrigger id="edit-grade">
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
                  <Label htmlFor="edit-group">Grupo</Label>
                  <Select value={editUser.group} onValueChange={(value) => setEditUser({ ...editUser, group: value })}>
                    <SelectTrigger id="edit-group">
                      <SelectValue placeholder="Seleccionar grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Grupo 1</SelectItem>
                      <SelectItem value="2">Grupo 2</SelectItem>
                      <SelectItem value="3">Grupo 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateUser}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el usuario del sistema.
              <br />
              <br />
              <strong>Nota:</strong> No se pueden eliminar usuarios que tengan datos asociados (calificaciones,
              horarios, etc.).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-1/4">
              <Label htmlFor="role-filter">Rol</Label>
              <Select value={roleFilter || ""} onValueChange={(value) => setRoleFilter(value === "all" ? null : value)}>
                <SelectTrigger id="role-filter">
                  <SelectValue placeholder="Todos los roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="teacher">Profesor</SelectItem>
                  <SelectItem value="student">Estudiante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <Label htmlFor="grade-filter">Grado (Estudiantes)</Label>
              <Select
                value={gradeFilter || ""}
                onValueChange={(value) => setGradeFilter(value === "all" ? null : value)}
              >
                <SelectTrigger id="grade-filter">
                  <SelectValue placeholder="Todos los grados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grados</SelectItem>
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
              <Label htmlFor="group-filter">Grupo (Estudiantes)</Label>
              <Select
                value={groupFilter || ""}
                onValueChange={(value) => setGroupFilter(value === "all" ? null : value)}
              >
                <SelectTrigger id="group-filter">
                  <SelectValue placeholder="Todos los grupos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grupos</SelectItem>
                  <SelectItem value="1">Grupo 1</SelectItem>
                  <SelectItem value="2">Grupo 2</SelectItem>
                  <SelectItem value="3">Grupo 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <Label htmlFor="search">Buscar</Label>
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nombre, correo, rol o grado/grupo..."
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
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo Electrónico</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Grado/Grupo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`capitalize ${
                        user.role === "admin"
                          ? "text-blue-600"
                          : user.role === "teacher"
                            ? "text-green-600"
                            : "text-orange-600"
                      }`}
                    >
                      {user.role === "admin" ? "Administrador" : user.role === "teacher" ? "Profesor" : "Estudiante"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.role === "student" && user.grade && user.group ? `${user.grade} - Grupo ${user.group}` : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(user.id)}
                        className="h-8 w-8"
                        title="Editar usuario"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(user.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No se encontraron usuarios con los filtros seleccionados
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
