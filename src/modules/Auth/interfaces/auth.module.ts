import { Module } from '@nestjs/common';
import { AuthController } from './auth.controlles';
import { AuthService } from './auth.service';

@Module({
  // imports: [],
  controllers: [ AuthController ],
    providers: [AuthService ],
})
export class AuthModule {}
