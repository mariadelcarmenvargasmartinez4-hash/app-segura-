import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
//import { UtilService } from 'src/common/services/util.service';
import { UtilService } from 'src/common/services/util.services';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private utilSvc: UtilService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.utilSvc.checkPassword(
      password,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user.id,
      username: user.username,
    };

    const accessToken = await this.utilSvc.generateJWT(payload, '60s');
    const refreshToken = await this.utilSvc.generateJWT(payload, '7d');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.utilSvc.getPayload(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException();
      }

      const newPayload = {
        id: user.id,
        username: user.username,
      };

      const accessToken = await this.utilSvc.generateJWT(newPayload, '60s');

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}