import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class LogsService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: {
    statusCode: number;
    path: string;
    error: string;
    errorCode: string;
    userId?: number;
  }) {
    return this.prisma.logs.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    });
  }
  async getAllLogs() {
  return this.prisma.logs.findMany({
    orderBy: { timestamp: 'desc' }
  });
}
  async getLogsByUser(userId: number) {
  return this.prisma.logs.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' }
  });
}
// Método para obtener logs con filtros (fecha, usuario, errorCode)
// Método para obtener logs con filtros + paginación
async getLogs(filters: any) {

  const {
    startDate,
    endDate,
    userId,
    errorCode,
    page = 1,
    limit = 10
  } = filters;

  // PAGINACIÓN
  const skip = (page - 1) * limit;

  // WHERE DINÁMICO
  const where: any = {

    ...(userId && {
      userId: Number(userId)
    }),

    ...(errorCode && {
      errorCode
    }),

    ...(startDate || endDate
      ? {
          timestamp: {

            ...(startDate && {
              gte: new Date(startDate)
            }),

            ...(endDate && {
              lte: new Date(endDate)
            }),
          }
        }
      : {})
  };

  // TOTAL DE REGISTROS
  const total = await this.prisma.logs.count({
    where
  });

  // LOGS PAGINADOS
  const logs = await this.prisma.logs.findMany({

    where,

    orderBy: {
      timestamp: 'desc',
    },

    include: {
      user: {
        select: {
          username: true
        },
      },
    },

    skip,
    take: Number(limit),
  });

  // RESPUESTA FINAL
  return {

    data: logs,

    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
}

}