import { Controller, Get, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { LogsService } from '../services/logs.service';
import { AuthGuard } from '../guards/auth.guardas';


@Controller('api/logs')
export class LogsController {

  constructor(private readonly logsService: LogsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getLogs(@Req() req: any) {

    const user = req.user;

    //  ADMIN → ve todo
    if (user.role === 'ADMIN') {
      return this.logsService.getAllLogs();
    }

    //  USER → solo sus logs
    if (user.role === 'USER') {
      return this.logsService.getLogsByUser(user.id);
    }

    throw new ForbiddenException('No autorizado');
  }
}