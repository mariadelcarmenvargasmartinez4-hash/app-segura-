import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controlles';
import { TaskService } from './tasks.service';
import { databaseProvider } from '../../../common/providers/database.provider';

@Module({
  controllers: [TaskController],
  providers: [TaskService, databaseProvider[0]],
})
export class TaskModule {}
