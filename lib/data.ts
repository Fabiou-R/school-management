// Mock data for the application

export type Subject = {
  id: string
  name: string
  description: string
}

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "teacher" | "student"
  password: string // Contraseña obligatoria para todos los usuarios
  grade?: string // Grado para estudiantes (Preescolar, 1°, 2°, etc.)
  group?: string // Grupo para estudiantes (1, 2, 3, etc.)
  subjects?: string[] // IDs de materias para profesores
}

export type Grade = {
  id: string
  studentId: string
  subjectId: string
  teacherId: string
  value: number
  period: string
  date: string
}

export type Schedule = {
  id: string
  grade: string
  group: string
  dayOfWeek: number // 0-6 (domingo a sábado)
  timeSlot: number // 1-8 (periodos de clase)
  subjectId: string
  teacherId: string
}

// Mock subjects
export const subjects: Subject[] = [
  { id: "1", name: "Matemáticas", description: "Álgebra, geometría y cálculo" },
  { id: "2", name: "Ciencias", description: "Física, química y biología" },
  { id: "3", name: "Historia", description: "Historia mundial y local" },
  { id: "4", name: "Literatura", description: "Comprensión y análisis de textos" },
  { id: "5", name: "Inglés", description: "Idioma extranjero" },
]

// Mock users
export const users: User[] = [
  { id: "1", name: "Admin User", email: "admin@example.com", role: "admin", password: "admin123" },
  {
    id: "2",
    name: "Juan Pérez",
    email: "teacher1@example.com",
    role: "teacher",
    password: "teacher123",
    subjects: ["1", "2"], // Matemáticas y Ciencias
  },
  {
    id: "3",
    name: "María López",
    email: "teacher2@example.com",
    role: "teacher",
    password: "teacher123",
    subjects: ["3", "4"], // Historia y Literatura
  },
  {
    id: "4",
    name: "Carlos Rodríguez",
    email: "student1@example.com",
    role: "student",
    password: "student123",
    grade: "1°",
    group: "1",
  },
  {
    id: "5",
    name: "Ana Martínez",
    email: "student2@example.com",
    role: "student",
    password: "student123",
    grade: "1°",
    group: "2",
  },
  {
    id: "6",
    name: "Pedro Sánchez",
    email: "student3@example.com",
    role: "student",
    password: "student123",
    grade: "2°",
    group: "1",
  },
  {
    id: "7",
    name: "Laura Gómez",
    email: "student4@example.com",
    role: "student",
    password: "student123",
    grade: "2°",
    group: "2",
  },
]

// Mock grades
export const grades: Grade[] = [
  { id: "1", studentId: "4", subjectId: "1", teacherId: "2", value: 85, period: "1er Trimestre", date: "2023-03-15" },
  { id: "2", studentId: "4", subjectId: "2", teacherId: "3", value: 78, period: "1er Trimestre", date: "2023-03-18" },
  { id: "3", studentId: "4", subjectId: "3", teacherId: "2", value: 92, period: "1er Trimestre", date: "2023-03-20" },
  { id: "4", studentId: "5", subjectId: "1", teacherId: "2", value: 90, period: "1er Trimestre", date: "2023-03-15" },
  { id: "5", studentId: "5", subjectId: "2", teacherId: "3", value: 85, period: "1er Trimestre", date: "2023-03-18" },
  { id: "6", studentId: "5", subjectId: "3", teacherId: "2", value: 88, period: "1er Trimestre", date: "2023-03-20" },
  { id: "7", studentId: "6", subjectId: "1", teacherId: "2", value: 75, period: "1er Trimestre", date: "2023-03-15" },
  { id: "8", studentId: "6", subjectId: "2", teacherId: "3", value: 82, period: "1er Trimestre", date: "2023-03-18" },
  { id: "9", studentId: "6", subjectId: "3", teacherId: "2", value: 79, period: "1er Trimestre", date: "2023-03-20" },
  // Añadir más calificaciones para diferentes periodos
  { id: "10", studentId: "4", subjectId: "1", teacherId: "2", value: 88, period: "2do Trimestre", date: "2023-06-15" },
  { id: "11", studentId: "4", subjectId: "2", teacherId: "3", value: 82, period: "2do Trimestre", date: "2023-06-18" },
  { id: "12", studentId: "4", subjectId: "3", teacherId: "2", value: 90, period: "2do Trimestre", date: "2023-06-20" },
  { id: "13", studentId: "5", subjectId: "1", teacherId: "2", value: 92, period: "2do Trimestre", date: "2023-06-15" },
  { id: "14", studentId: "5", subjectId: "2", teacherId: "3", value: 87, period: "2do Trimestre", date: "2023-06-18" },
  { id: "15", studentId: "5", subjectId: "3", teacherId: "2", value: 85, period: "2do Trimestre", date: "2023-06-20" },
]

// Mock horarios
export const schedules: Schedule[] = [
  // Horario para 1° - Grupo 1
  { id: "1", grade: "1°", group: "1", dayOfWeek: 1, timeSlot: 1, subjectId: "1", teacherId: "2" }, // Lunes, 1ª hora, Matemáticas
  { id: "2", grade: "1°", group: "1", dayOfWeek: 1, timeSlot: 2, subjectId: "2", teacherId: "2" }, // Lunes, 2ª hora, Ciencias
  { id: "3", grade: "1°", group: "1", dayOfWeek: 1, timeSlot: 3, subjectId: "3", teacherId: "3" }, // Lunes, 3ª hora, Historia
  { id: "4", grade: "1°", group: "1", dayOfWeek: 2, timeSlot: 1, subjectId: "4", teacherId: "3" }, // Martes, 1ª hora, Literatura
  { id: "5", grade: "1°", group: "1", dayOfWeek: 2, timeSlot: 2, subjectId: "5", teacherId: "2" }, // Martes, 2ª hora, Inglés

  // Horario para 1° - Grupo 2
  { id: "6", grade: "1°", group: "2", dayOfWeek: 1, timeSlot: 1, subjectId: "3", teacherId: "3" }, // Lunes, 1ª hora, Historia
  { id: "7", grade: "1°", group: "2", dayOfWeek: 1, timeSlot: 2, subjectId: "4", teacherId: "3" }, // Lunes, 2ª hora, Literatura
  { id: "8", grade: "1°", group: "2", dayOfWeek: 1, timeSlot: 3, subjectId: "5", teacherId: "2" }, // Lunes, 3ª hora, Inglés
  { id: "9", grade: "1°", group: "2", dayOfWeek: 2, timeSlot: 1, subjectId: "1", teacherId: "2" }, // Martes, 1ª hora, Matemáticas
  { id: "10", grade: "1°", group: "2", dayOfWeek: 2, timeSlot: 2, subjectId: "2", teacherId: "2" }, // Martes, 2ª hora, Ciencias

  // Horario para 2° - Grupo 1
  { id: "11", grade: "2°", group: "1", dayOfWeek: 1, timeSlot: 1, subjectId: "5", teacherId: "2" }, // Lunes, 1ª hora, Inglés
  { id: "12", grade: "2°", group: "1", dayOfWeek: 1, timeSlot: 2, subjectId: "1", teacherId: "2" }, // Lunes, 2ª hora, Matemáticas
  { id: "13", grade: "2°", group: "1", dayOfWeek: 1, timeSlot: 3, subjectId: "2", teacherId: "2" }, // Lunes, 3ª hora, Ciencias
  { id: "14", grade: "2°", group: "1", dayOfWeek: 2, timeSlot: 1, subjectId: "3", teacherId: "3" }, // Martes, 1ª hora, Historia
  { id: "15", grade: "2°", group: "1", dayOfWeek: 2, timeSlot: 2, subjectId: "4", teacherId: "3" }, // Martes, 2ª hora, Literatura

  // Horario para 2° - Grupo 2
  { id: "16", grade: "2°", group: "2", dayOfWeek: 1, timeSlot: 1, subjectId: "2", teacherId: "2" }, // Lunes, 1ª hora, Ciencias
  { id: "17", grade: "2°", group: "2", dayOfWeek: 1, timeSlot: 2, subjectId: "3", teacherId: "3" }, // Lunes, 2ª hora, Historia
  { id: "18", grade: "2°", group: "2", dayOfWeek: 1, timeSlot: 3, subjectId: "4", teacherId: "3" }, // Lunes, 3ª hora, Literatura
  { id: "19", grade: "2°", group: "2", dayOfWeek: 2, timeSlot: 1, subjectId: "5", teacherId: "2" }, // Martes, 1ª hora, Inglés
  { id: "20", grade: "2°", group: "2", dayOfWeek: 2, timeSlot: 2, subjectId: "1", teacherId: "2" }, // Martes, 2ª hora, Matemáticas
]

// Helper functions to manipulate data
export function getSubjectById(id: string): Subject | undefined {
  return subjects.find((subject) => subject.id === id)
}

export function getUserById(id: string): User | undefined {
  return users.find((user) => user.id === id)
}

export function getStudents(): User[] {
  return users.filter((user) => user.role === "student")
}

export function getTeachers(): User[] {
  return users.filter((user) => user.role === "teacher")
}

export function getStudentGrades(studentId: string): Array<Grade & { subject: Subject }> {
  return grades
    .filter((grade) => grade.studentId === studentId)
    .map((grade) => {
      const subject = getSubjectById(grade.subjectId)
      return { ...grade, subject: subject! }
    })
}

// Función para obtener las calificaciones de un estudiante agrupadas por materia y periodo
export function getStudentGradesBySubjectAndPeriod(studentId: string) {
  const studentGrades = grades.filter((grade) => grade.studentId === studentId)
  const result: Record<
    string,
    {
      subjectName: string
      periods: Record<string, number>
      average: number
    }
  > = {}

  // Periodos disponibles
  const periods = ["1er Trimestre", "2do Trimestre", "3er Trimestre"]

  // Agrupar por materia
  studentGrades.forEach((grade) => {
    const subject = getSubjectById(grade.subjectId)
    if (!subject) return

    if (!result[subject.id]) {
      result[subject.id] = {
        subjectName: subject.name,
        periods: {},
        average: 0,
      }
    }

    result[subject.id].periods[grade.period] = grade.value
  })

  // Calcular promedios y asegurar que todos los periodos estén representados
  Object.values(result).forEach((subjectData) => {
    let sum = 0
    let count = 0

    // Asegurar que todos los periodos estén representados
    periods.forEach((period) => {
      if (!subjectData.periods[period]) {
        subjectData.periods[period] = 0 // O null si prefieres
      } else {
        sum += subjectData.periods[period]
        count++
      }
    })

    subjectData.average = count > 0 ? Math.round((sum / count) * 10) / 10 : 0
  })

  return result
}

// Función para obtener estudiantes por grado y grupo
export function getStudentsByGradeAndGroup(grade?: string, group?: string): User[] {
  return users.filter((user) => {
    if (user.role !== "student") return false

    // Si no se especifica grado ni grupo, devolver todos los estudiantes
    if (!grade && !group) return true

    // Si solo se especifica grado
    if (grade && !group) return user.grade === grade

    // Si solo se especifica grupo
    if (!grade && group) return user.group === group

    // Si se especifican ambos
    return user.grade === grade && user.group === group
  })
}

// Función para obtener horarios por grado y grupo
export function getScheduleByGradeAndGroup(grade: string, group: string): Schedule[] {
  return schedules.filter((schedule) => schedule.grade === grade && schedule.group === group)
}

// Función para obtener materias asignadas a un profesor
export function getTeacherSubjects(teacherId: string): Subject[] {
  const teacher = users.find((user) => user.id === teacherId && user.role === "teacher")
  if (!teacher || !teacher.subjects) return []

  return subjects.filter((subject) => teacher.subjects?.includes(subject.id))
}

// Mock functions to add/update data (in a real app, these would interact with a database)
let nextUserId = users.length + 1
let nextSubjectId = subjects.length + 1
let nextGradeId = grades.length + 1
let nextScheduleId = schedules.length + 1

export function addUser(user: Omit<User, "id">): User {
  const newUser = { ...user, id: String(nextUserId++) }
  users.push(newUser)
  return newUser
}

export function addSubject(subject: Omit<Subject, "id">): Subject {
  const newSubject = { ...subject, id: String(nextSubjectId++) }
  subjects.push(newSubject)
  return newSubject
}

export function addGrade(grade: Omit<Grade, "id">): Grade {
  const newGrade = { ...grade, id: String(nextGradeId++) }
  grades.push(newGrade)
  return newGrade
}

export function addSchedule(schedule: Omit<Schedule, "id">): Schedule {
  const newSchedule = { ...schedule, id: String(nextScheduleId++) }
  schedules.push(newSchedule)
  return newSchedule
}

export function updateGrade(id: string, value: number): Grade | undefined {
  const gradeIndex = grades.findIndex((grade) => grade.id === id)
  if (gradeIndex !== -1) {
    grades[gradeIndex] = { ...grades[gradeIndex], value }
    return grades[gradeIndex]
  }
  return undefined
}

export function updateFullGrade(
  id: string,
  updates: { value?: number; subjectId?: string; period?: string; date?: string; teacherId?: string },
): Grade | undefined {
  const gradeIndex = grades.findIndex((grade) => grade.id === id)
  if (gradeIndex !== -1) {
    grades[gradeIndex] = { ...grades[gradeIndex], ...updates }
    return grades[gradeIndex]
  }
  return undefined
}

export function updateTeacherSubjects(teacherId: string, subjectIds: string[]): User | undefined {
  const teacherIndex = users.findIndex((user) => user.id === teacherId && user.role === "teacher")
  if (teacherIndex !== -1) {
    users[teacherIndex] = { ...users[teacherIndex], subjects: subjectIds }
    return users[teacherIndex]
  }
  return undefined
}

export function deleteSubject(id: string): boolean {
  const subjectIndex = subjects.findIndex((subject) => subject.id === id)
  if (subjectIndex !== -1) {
    // Check if there are grades associated with this subject
    const hasGrades = grades.some((grade) => grade.subjectId === id)
    if (hasGrades) {
      return false // Cannot delete subject with associated grades
    }

    subjects.splice(subjectIndex, 1)
    return true
  }
  return false
}

export function deleteSchedule(id: string): boolean {
  const scheduleIndex = schedules.findIndex((schedule) => schedule.id === id)
  if (scheduleIndex !== -1) {
    schedules.splice(scheduleIndex, 1)
    return true
  }
  return false
}

export type ParceladorTema = {
  id: string
  titulo: string
  descripcion: string
  objetivos: string
  contenido: string
  actividades: string
  recursos: string
  evaluacion: string
  fechaInicio: string
  fechaFin: string
  materiaId: string
  profesorId: string
  grado: string
  grupo: string
}

// Mock parcelador de temas
export const parceladorTemas: ParceladorTema[] = [
  {
    id: "1",
    titulo: "Introducción al Álgebra",
    descripcion: "Fundamentos básicos del álgebra y operaciones con variables",
    objetivos: "Comprender los conceptos básicos del álgebra y resolver ecuaciones simples",
    contenido: "Variables, expresiones algebraicas, ecuaciones lineales",
    actividades: "Ejercicios prácticos, trabajo en grupo, resolución de problemas",
    recursos: "Libro de texto, material digital, videos explicativos",
    evaluacion: "Examen escrito, participación en clase, tareas",
    fechaInicio: "2025-05-01",
    fechaFin: "2025-05-15",
    materiaId: "1", // Matemáticas
    profesorId: "2", // Juan Pérez
    grado: "1°",
    grupo: "1",
  },
  {
    id: "2",
    titulo: "La célula y sus funciones",
    descripcion: "Estudio de la estructura y función celular",
    objetivos: "Identificar las partes de la célula y comprender sus funciones",
    contenido: "Estructura celular, organelos, funciones celulares",
    actividades: "Observación al microscopio, dibujos, exposiciones",
    recursos: "Microscopios, láminas, modelos 3D",
    evaluacion: "Informe de laboratorio, examen teórico, maqueta",
    fechaInicio: "2025-05-01",
    fechaFin: "2025-05-20",
    materiaId: "2", // Ciencias
    profesorId: "2", // Juan Pérez
    grado: "1°",
    grupo: "1",
  },
  {
    id: "3",
    titulo: "Revolución Francesa",
    descripcion: "Causas, desarrollo y consecuencias de la Revolución Francesa",
    objetivos: "Analizar el impacto histórico de la Revolución Francesa",
    contenido: "Antecedentes, etapas, personajes importantes, consecuencias",
    actividades: "Lectura de documentos históricos, debate, línea de tiempo",
    recursos: "Documentales, textos históricos, mapas",
    evaluacion: "Ensayo, participación en debate, prueba escrita",
    fechaInicio: "2025-05-05",
    fechaFin: "2025-05-25",
    materiaId: "3", // Historia
    profesorId: "3", // María López
    grado: "2°",
    grupo: "1",
  },
]

// Funciones para manipular parcelador de temas
let nextParceladorId = parceladorTemas.length + 1

export function getParceladorTemasByProfesor(profesorId: string): ParceladorTema[] {
  return parceladorTemas.filter((tema) => tema.profesorId === profesorId)
}

export function getParceladorTemasByMateria(materiaId: string): ParceladorTema[] {
  return parceladorTemas.filter((tema) => tema.materiaId === materiaId)
}

export function getParceladorTemasByGradoGrupo(grado: string, grupo: string): ParceladorTema[] {
  return parceladorTemas.filter((tema) => tema.grado === grado && tema.grupo === grupo)
}

export function addParceladorTema(tema: Omit<ParceladorTema, "id">): ParceladorTema {
  const newTema = { ...tema, id: String(nextParceladorId++) }
  parceladorTemas.push(newTema)
  return newTema
}

export function updateParceladorTema(
  id: string,
  updates: Partial<Omit<ParceladorTema, "id">>,
): ParceladorTema | undefined {
  const temaIndex = parceladorTemas.findIndex((tema) => tema.id === id)
  if (temaIndex !== -1) {
    parceladorTemas[temaIndex] = { ...parceladorTemas[temaIndex], ...updates }
    return parceladorTemas[temaIndex]
  }
  return undefined
}

export function deleteParceladorTema(id: string): boolean {
  const temaIndex = parceladorTemas.findIndex((tema) => tema.id === id)
  if (temaIndex !== -1) {
    parceladorTemas.splice(temaIndex, 1)
    return true
  }
  return false
}

export function updateUser(updatedUser: Partial<User> & { id: string }): User | undefined {
  const userIndex = users.findIndex((u) => u.id === updatedUser.id)
  if (userIndex === -1) return undefined

  // Obtener el usuario actual para mantener los campos que no se actualizan
  const currentUser = users[userIndex]

  // Crear un nuevo objeto de usuario con los campos actualizados
  const newUser = { ...currentUser }

  // Actualizar los campos proporcionados
  if (updatedUser.name) newUser.name = updatedUser.name
  if (updatedUser.email) newUser.email = updatedUser.email
  if (updatedUser.password) newUser.password = updatedUser.password
  if (updatedUser.role) newUser.role = updatedUser.role

  // Manejar campos específicos según el rol
  if (updatedUser.role === "student") {
    newUser.grade = updatedUser.grade
    newUser.group = updatedUser.group
    // Eliminar campos que no aplican a estudiantes
    delete newUser.subjects
  } else if (updatedUser.role === "teacher") {
    // Mantener o inicializar el array de materias
    newUser.subjects = updatedUser.subjects || []
    // Eliminar campos que no aplican a profesores
    delete newUser.grade
    delete newUser.group
  } else {
    // Para administradores, eliminar campos específicos
    delete newUser.grade
    delete newUser.group
    delete newUser.subjects
  }

  // Actualizar el usuario en el array
  users[userIndex] = newUser

  return newUser
}

export function deleteUser(id: string): boolean {
  // Verificar si el usuario tiene datos asociados
  const hasGrades = grades.some((grade) => grade.studentId === id || grade.teacherId === id)
  const hasSchedules = schedules.some((schedule) => schedule.teacherId === id)
  const hasParcelador = parceladorTemas.some((tema) => tema.profesorId === id)

  // No permitir eliminar si tiene datos asociados
  if (hasGrades || hasSchedules || hasParcelador) {
    return false
  }

  const userIndex = users.findIndex((user) => user.id === id)
  if (userIndex !== -1) {
    users.splice(userIndex, 1)
    return true
  }
  return false
}
