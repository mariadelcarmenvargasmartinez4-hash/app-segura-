import { Module } from '@nestjs/common';
//import { AuthModule } from './auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/Auth/interfaces/auth.module';
@Module({
  imports: [AuthModule, TaskModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

