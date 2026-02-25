import { Controller, Get, Param, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventDayDto } from './dto/event-response.dto';

@Controller('api/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Get('days')
  async getDays(): Promise<EventDayDto[]> {
    try {
      return await this.eventsService.getDaysWithSlots();
    } catch (error) {
      this.logger.error('Error al obtener días:', error);
      throw new HttpException(
        {
          message: 'Error al obtener los días de eventos',
          error: error.message || 'Error desconocido',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Listado público de instituciones confirmadas por slot (solo nombre y estudiantes).
   */
  @Get('slots/:slotId/confirmed-institutions')
  async getConfirmedInstitutions(@Param('slotId') slotId: string) {
    try {
      const result = await this.eventsService.getConfirmedInstitutionsBySlot(slotId);
      if (!result) {
        throw new HttpException('Horario no encontrado', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error al obtener instituciones confirmadas:', error);
      throw new HttpException(
        { message: 'Error al obtener instituciones confirmadas' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
