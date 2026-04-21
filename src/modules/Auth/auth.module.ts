import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../../common/services/prisma.module';
//import { JwtStrategy } from './jwt.strategy';
import { JwtStrategy } from './jwt.strategy';
//import { CommonModule } from 'src/common/common.module';
import { CommonModule } from '../../common/common.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CommonModule, UserModule,
    PrismaModule,
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '15m' }, // access token 60s para pruebas, 15m se presente al profe
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}