import { Module } from '@nestjs/common';
import { AuthModule } from './modules/Auth/interfaces/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  
})
export class AppModule {}
