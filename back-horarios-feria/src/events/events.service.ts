import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventDayDto } from './dto/event-response.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene todos los días de eventos con sus horarios y cupos disponibles
   * Calcula los cupos disponibles en tiempo real basado en las reservas
   */
  async getDaysWithSlots(): Promise<EventDayDto[]> {
    const events = await this.prisma.event.findMany({
      include: {
        timeSlots: {
          include: {
            reservations: {
              where: {
                status: {
                  in: ['pendiente', 'confirmada'],
                },
              },
            },
          },
          orderBy: {
            timeStart: 'asc',
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return events.map((event) => {
      const slots = event.timeSlots.map((slot) => {
        // Calcular estudiantes reservados en este slot
        const reservedStudents = slot.reservations.reduce(
          (sum, reservation) => sum + reservation.students,
          0,
        );

        // Calcular cupos disponibles
        const available = Math.max(0, slot.capacity - reservedStudents);

        // Formatear horario
        const time = `${slot.timeStart} - ${slot.timeEnd}`;

        return {
          id: slot.id,
          time,
          capacity: slot.capacity,
          available,
        };
      });

      // Formatear fecha del día
      const day = this.formatDate(event.date);

      return {
        id: event.id,
        day,
        slots,
      };
    });
  }

  /**
   * Formatea la fecha en formato legible
   */
  private formatDate(date: Date): string {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];

    return `${dayName} ${day} ${month}`;
  }
}
