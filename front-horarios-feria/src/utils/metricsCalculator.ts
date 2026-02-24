import type { EventDay, SchoolReservation } from '../data/eventData'

/**
 * Calcula métricas generales del evento
 */
export function calculateGeneralMetrics(days: EventDay[]) {
  // Obtener todas las reservas de todos los días y horarios
  const allReservations: SchoolReservation[] = []
  days.forEach((day) => {
    day.slots.forEach((slot) => {
      allReservations.push(...slot.schools)
    })
  })

  // Total de colegios únicos (por AMIE)
  const uniqueSchools = new Set(allReservations.map((r) => r.amie))
  const totalSchools = uniqueSchools.size

  // Total de estudiantes
  const totalStudents = allReservations.reduce(
    (sum, r) => sum + r.students,
    0
  )

  // Capacidad total global
  const totalCapacity = days.reduce(
    (sum, day) =>
      sum + day.slots.reduce((slotSum, slot) => slotSum + slot.capacity, 0),
    0
  )

  // Tasa de ocupación global
  const occupancyRate = totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0

  // Horarios más solicitados (por estudiantes)
  const slotDemand: Record<string, number> = {}
  days.forEach((day) => {
    day.slots.forEach((slot) => {
      const key = `${day.day} - ${slot.time}`
      const students = slot.schools.reduce((sum, s) => sum + s.students, 0)
      slotDemand[key] = students
    })
  })

  const sortedSlots = Object.entries(slotDemand).sort((a, b) => b[1] - a[1])
  const mostRequested = sortedSlots[0]?.[0] || 'N/A'
  const leastRequested = sortedSlots[sortedSlots.length - 1]?.[0] || 'N/A'

  // Día con mayor demanda
  const dayDemand: Record<string, number> = {}
  days.forEach((day) => {
    const students = day.slots.reduce(
      (sum, slot) =>
        sum + slot.schools.reduce((s, r) => s + r.students, 0),
      0
    )
    dayDemand[day.day] = students
  })

  const sortedDays = Object.entries(dayDemand).sort((a, b) => b[1] - a[1])
  const dayWithMostDemand = sortedDays[0]?.[0] || 'N/A'

  return {
    totalSchools,
    totalStudents,
    totalCapacity,
    occupancyRate: Math.round(occupancyRate * 100) / 100,
    mostRequested,
    leastRequested,
    dayWithMostDemand,
  }
}

/**
 * Calcula métricas por día
 */
export function calculateDayMetrics(days: EventDay[]) {
  return days.map((day) => {
    const allReservations: SchoolReservation[] = []
    day.slots.forEach((slot) => {
      allReservations.push(...slot.schools)
    })

    const uniqueSchools = new Set(allReservations.map((r) => r.amie))
    const totalSchools = uniqueSchools.size

    const totalStudents = allReservations.reduce(
      (sum, r) => sum + r.students,
      0
    )

    const totalCapacity = day.slots.reduce(
      (sum, slot) => sum + slot.capacity,
      0
    )

    const occupancyRate =
      totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0

    // Distribución por horarios
    const slotDistribution = day.slots.map((slot) => ({
      time: slot.time,
      students: slot.schools.reduce((sum, s) => sum + s.students, 0),
      schools: slot.schools.length,
      available: slot.available,
      capacity: slot.capacity,
      occupancyRate:
        slot.capacity > 0
          ? ((slot.capacity - slot.available) / slot.capacity) * 100
          : 0,
    }))

    return {
      dayId: day.id,
      day: day.day,
      totalSchools,
      totalStudents,
      totalCapacity,
      occupancyRate: Math.round(occupancyRate * 100) / 100,
      slotDistribution,
    }
  })
}

/**
 * Calcula métricas por horario
 */
export function calculateSlotMetrics(days: EventDay[]) {
  const slotMetrics: Array<{
    dayId: string
    day: string
    slotId: string
    time: string
    schools: number
    students: number
    available: number
    occupied: number
    capacity: number
    occupancyRate: number
  }> = []

  days.forEach((day) => {
    day.slots.forEach((slot) => {
      const occupied = slot.capacity - slot.available
      const occupancyRate =
        slot.capacity > 0 ? (occupied / slot.capacity) * 100 : 0

      slotMetrics.push({
        dayId: day.id,
        day: day.day,
        slotId: slot.id,
        time: slot.time,
        schools: slot.schools.length,
        students: slot.schools.reduce((sum, s) => sum + s.students, 0),
        available: slot.available,
        occupied,
        capacity: slot.capacity,
        occupancyRate: Math.round(occupancyRate * 100) / 100,
      })
    })
  })

  return slotMetrics
}

/**
 * Obtiene todas las reservas con información completa
 */
export function getAllReservations(days: EventDay[]): SchoolReservation[] {
  const allReservations: SchoolReservation[] = []
  days.forEach((day) => {
    day.slots.forEach((slot) => {
      slot.schools.forEach((reservation) => {
        allReservations.push(reservation)
      })
    })
  })
  return allReservations
}

/**
 * Calcula alertas automáticas
 */
export function calculateAlerts(days: EventDay[]) {
  const alerts: Array<{
    type: 'full' | 'almost-full' | 'low-occupancy'
    message: string
    severity: 'error' | 'warning' | 'info'
  }> = []

  days.forEach((day) => {
    day.slots.forEach((slot) => {
      const occupied = slot.capacity - slot.available

      // Horario completamente lleno
      if (slot.available === 0) {
        alerts.push({
          type: 'full',
          message: `${day.day} - ${slot.time}: Sin cupos disponibles`,
          severity: 'error',
        })
      }
      // Horario próximo a llenarse (< 20 cupos)
      else if (slot.available < 20) {
        alerts.push({
          type: 'almost-full',
          message: `${day.day} - ${slot.time}: Solo ${slot.available} cupos disponibles`,
          severity: 'warning',
        })
      }
    })

    // Día con baja inscripción (< 30% ocupación)
    const dayStudents = day.slots.reduce(
      (sum, slot) =>
        sum + slot.schools.reduce((s, r) => s + r.students, 0),
      0
    )
    const dayCapacity = day.slots.reduce(
      (sum, slot) => sum + slot.capacity,
      0
    )
    const dayOccupancyRate =
      dayCapacity > 0 ? (dayStudents / dayCapacity) * 100 : 0

    if (dayOccupancyRate < 30 && dayStudents > 0) {
      alerts.push({
        type: 'low-occupancy',
        message: `${day.day}: Baja ocupación (${Math.round(dayOccupancyRate)}%)`,
        severity: 'info',
      })
    }
  })

  return alerts
}
