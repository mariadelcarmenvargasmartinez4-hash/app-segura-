import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaModule } from '../../common/services/prisma.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [PrismaModule,CommonModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}