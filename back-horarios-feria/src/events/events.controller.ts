import { Controller, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventDayDto } from './dto/event-response.dto';

@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('days')
  async getDays(): Promise<EventDayDto[]> {
    return this.eventsService.getDaysWithSlots();
  }
}
