import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../common/services/prisma.module';
//import { JwtStrategy } from './jwt.strategy';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '60s' }, // access token
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}