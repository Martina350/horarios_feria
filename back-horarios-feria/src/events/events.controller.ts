import { Controller, Get, HttpException, HttpStatus, Logger } from '@nestjs/common';
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
}
