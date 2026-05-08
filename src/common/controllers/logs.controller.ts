import {
  Controller,
  Get,
  UseGuards,
  Query,
  Req,
  ForbiddenException
} from '@nestjs/common';

import { LogsService } from '../services/logs.service';
import { AuthGuard } from '../guards/auth.guardas';

@Controller('api/logs')
export class LogsController {

  constructor(private readonly logsService: LogsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getLogs(
    @Req() req: any,
    @Query() query: any
  ) {
    const user = req.user;

    const filters = {
      userId: query.userId,
      errorCode: query.errorCode,
      startDate: query.startDate,
      endDate: query.endDate,
    };

    //  ADMIN → puede ver todo con filtros
    if (user.role === 'ADMIN') {
      return this.logsService.getLogs(filters);
    }

    //  USER → solo SUS logs (ignora userId externo)
    if (user.role === 'USER') {
      return this.logsService.getLogs({
        ...filters,
        userId: user.id, //  fuerza seguridad
      });
    }

    throw new ForbiddenException('No autorizado');
  }
}