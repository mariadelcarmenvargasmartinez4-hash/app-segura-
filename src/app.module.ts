import { Module } from '@nestjs/common';
import { AuthModule } from './modules/Auth/interfaces/auth.module';
import { homeworkModule } from './modules/homework/interfaces/homework.module';
@Module({
  imports: [
   AuthModule,
    homeworkModule,
  ],
  
})
export class AppModule {}
