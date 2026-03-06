import { Module } from '@nestjs/common';
//import { AuthModule } from './auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/Auth/interfaces/auth.module';
import { PostgresProvider } from './common/providers/database.provider';
@Module({
  imports: [AuthModule, TaskModule],
  controllers: [],
  //providers: [],
  providers: [PostgresProvider],
  exports: [PostgresProvider],
})
export class AppModule {}

