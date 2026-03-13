import { Module } from '@nestjs/common';
//import { AuthModule } from './auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { AuthModule } from './modules/Auth/auth.module';
import { PostgresProvider } from './common/providers/database.provider';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [AuthModule, TaskModule,UserModule],
  controllers: [],
  //providers: [],
  providers: [PostgresProvider],
  exports: [PostgresProvider],
})
export class AppModule {}

