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

    // PAGINACIÓN
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;

    const filters = {
      userId: query.userId,
      errorCode: query.errorCode,
      startDate: query.startDate,
      endDate: query.endDate,
      page,
      limit
    };

    // ADMIN → puede ver todo
    if (user.role === 'ADMIN') {
      return this.logsService.getLogs(filters);
    }

    // USER → solo sus logs
    if (user.role === 'USER') {
      return this.logsService.getLogs({
        ...filters,
        userId: user.id
      });
    }

    throw new ForbiddenException('No autorizado');
  }
}