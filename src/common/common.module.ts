import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; //  IMPORTANTE

//import { UtilService } from './services/util.service';
import { PrismaService } from './services/prisma.service';
import { UtilService } from './services/util.services';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey', // lo debo  configurar en .env lo hare después
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [UtilService, PrismaService],
  exports: [UtilService, PrismaService], // 🔥 CLAVE
})
export class CommonModule {}