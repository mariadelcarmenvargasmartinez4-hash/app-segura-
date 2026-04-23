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
}