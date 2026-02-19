export type SchoolReservation = {
  amie: string
  schoolName: string
  coordinatorName: string
  email: string
  whatsapp: string
  students: number
}

export type TimeSlot = {
  id: string
  time: string
  capacity: number
  available: number
  schools: SchoolReservation[]
}

export type EventDay = {
  id: string
  day: string
  slots: TimeSlot[]
}

export const initialEventData: EventDay[] = [
  {
    id: '2026-03-16',
    day: 'Lunes 16 marzo',
    slots: [
      {
        id: '9-11',
        time: '09h00 - 11h00',
        capacity: 200,
        available: 200,
        schools: [],
      },
      {
        id: '11-13',
        time: '11h00 - 13h00',
        capacity: 200,
        available: 200,
        schools: [],
      },
      {
        id: '13-15',
        time: '13h00 - 15h00',
        capacity: 200,
        available: 200,
        schools: [],
      },
    ],
  },
  {
    id: '2026-03-17',
    day: 'Martes 17 marzo',
    slots: [
      {
        id: '9-11',
        time: '09h00 - 11h00',
        capacity: 200,
        available: 200,
        schools: [],
      },
      {
        id: '11-13',
        time: '11h00 - 13h00',
        capacity: 200,
        available: 200,
        schools: [],
      },
      {
        id: '13-15',
        time: '13h00 - 15h00',
        capacity: 200,
        available: 200,
        schools: [],
      },
    ],
  },
  {
    id: '2026-03-18',
    day: 'Jueves 18 marzo',
    slots: [
      {
        id: '9-11',
        time: '09h00 - 11h00',
        capacity: 200,
        available: 200,
        schools: [],
      },
      {
        id: '11-13',
        time: '11h00 - 13h00',
        capacity: 200,
        available: 200,
        schools: [],
      },
      {
        id: '13-15',
        time: '13h00 - 15h00',
        capacity: 200,
        available: 200,
        schools: [],
      },
    ],
  },
]

