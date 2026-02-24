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
    try {
      console.log('Iniciando consulta de eventos...');
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

      console.log(`Se encontraron ${events?.length || 0} eventos`);
      
      if (!events || events.length === 0) {
        console.warn('No se encontraron eventos en la base de datos');
        return [];
      }

      return events.map((event) => {
        if (!event.date) {
          console.error(`Evento ${event.id} no tiene fecha`);
          return null;
        }

        const slots = event.timeSlots?.map((slot) => {
          // Validar que el slot tenga los campos necesarios
          if (!slot.timeStart || !slot.timeEnd) {
            console.error(`Slot ${slot.id} no tiene timeStart o timeEnd`);
            return null;
          }

          // Calcular estudiantes reservados en este slot
          const reservedStudents = (slot.reservations || []).reduce(
            (sum, reservation) => sum + (reservation.students || 0),
            0,
          );

          // Calcular cupos disponibles
          const available = Math.max(0, (slot.capacity || 0) - reservedStudents);

          // Formatear horario
          const time = `${slot.timeStart} - ${slot.timeEnd}`;

          return {
            id: slot.id,
            time,
            capacity: slot.capacity || 0,
            available,
          };
        }).filter((slot) => slot !== null) || [];

        // Formatear fecha del día
        const day = this.formatDate(event.date);

        return {
          id: event.id,
          day,
          slots,
        };
      }).filter((event) => event !== null) as EventDayDto[];
    } catch (error) {
      console.error('Error al obtener días con slots:', error);
      throw error;
    }
  }

  /**
   * Formatea la fecha en formato legible
   * Usa métodos UTC para evitar problemas de zona horaria
   */
  private formatDate(date: Date | null | undefined): string {
    if (!date) {
      console.error('Fecha es null o undefined');
      return 'Fecha no disponible';
    }

    try {
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

      // Asegurar que date es un objeto Date
      const dateObj = date instanceof Date ? date : new Date(date);

      // Usar métodos UTC para evitar problemas de zona horaria
      // Si la fecha viene como '2026-03-16T00:00:00.000Z', queremos mostrar 16, no 15
      const dayName = days[dateObj.getUTCDay()];
      const day = dateObj.getUTCDate();
      const month = months[dateObj.getUTCMonth()];

      return `${dayName} ${day} ${month}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error, date);
      return 'Fecha inválida';
    }
  }
}
