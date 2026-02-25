/**
 * Tipos compartidos entre frontend y backend
 */

export type ReservationStatus = 'pendiente' | 'confirmada' | 'cancelada';

export interface ReservationResponse {
  id: string;
  amie: string;
  schoolName: string;
  coordinatorName: string;
  coordinatorLastName?: string;
  email: string;
  whatsapp: string;
  students: number;
  dayId: string;
  slotId: string;
  status: ReservationStatus;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  emailSent?: boolean;
}

export interface CreateReservationDto {
  amie: string;
  schoolName: string;
  coordinatorName: string;
  coordinatorLastName?: string;
  email: string;
  whatsapp: string;
  students: number;
  dayId: string;
  slotId: string;
}

export interface UpdateReservationDto {
  amie?: string;
  schoolName?: string;
  coordinatorName?: string;
  coordinatorLastName?: string;
  email?: string;
  whatsapp?: string;
  students?: number;
  dayId?: string;
  slotId?: string;
  status?: ReservationStatus;
}

export interface TimeSlotResponse {
  id: string;
  time: string;
  capacity: number;
  available: number;
}

export interface EventDayResponse {
  id: string;
  day: string;
  slots: TimeSlotResponse[];
}

/** Respuesta pública: instituciones confirmadas por slot (solo datos públicos) */
export interface ConfirmedInstitutionsResponse {
  day: string;
  time: string;
  institutions: Array<{ schoolName: string; students: number }>;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface AmieResponse {
  code: string;
  name: string;
}

export interface GeneralMetrics {
  totalSchools: number;
  totalStudents: number;
  totalCapacity: number;
  occupancyRate: number;
  mostRequestedSlots: Array<{
    slotId: string;
    time: string;
    day: string;
    students: number;
    reservations: number;
  }>;
  leastRequestedSlots: Array<{
    slotId: string;
    time: string;
    day: string;
    students: number;
    reservations: number;
  }>;
  highestDemandDay: {
    day: string;
    students: number;
  } | null;
}

export interface DayMetrics {
  dayId: string;
  day: string;
  totalSchools: number;
  totalStudents: number;
  capacity: number;
  occupancyRate: number;
  slots: Array<{
    slotId: string;
    time: string;
    capacity: number;
    available: number;
    occupied: number;
    occupancyPercentage: number;
  }>;
}

export interface SlotMetrics {
  slotId: string;
  day: string;
  time: string;
  capacity: number;
  available: number;
  occupied: number;
  schools: number;
  students: number;
  occupancyPercentage: number;
}
