import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // 🔥 MENSAJE REAL (solo para logs)
    const realMessage = exception.message || 'Internal error';

    // 🔥 MENSAJE PARA EL USUARIO (SIEMPRE IGUAL)
    let safeMessage = 'Error';

    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      safeMessage = 'No autorizado';
    }

    response.status(status).json({
      statusCode: status,
      message: safeMessage,   // 👈 lo que ve el frontend
      path: request.url,
      timestamp: new Date().toISOString(),

      // 🔥 opcional para debug interno
      errorCode: exception?.code || 'UNKNOWN_ERROR'
    });
  }
}