import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

 async login(username: string, password: string) {

  const user = await this.prisma.user.findUnique({
    where: { username },
  });

  if (!user)
    throw new UnauthorizedException('Credenciales inválidas');

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid)
    throw new UnauthorizedException('Credenciales inválidas');

  const payload = {
    sub: user.id,
    username: user.username,
  };

  const accessToken = this.jwtService.sign(payload, {
    expiresIn: '60s',
  });

  const refreshToken = this.jwtService.sign(payload, {
    expiresIn: '7d',
  });

  await this.prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

  async refreshToken(userId: number, refreshToken: string) {

  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user)
    throw new UnauthorizedException('Usuario no válido');

  if (user.refreshToken !== refreshToken)
    throw new UnauthorizedException('Refresh token inválido');

  const payload = {
    sub: user.id,
    username: user.username,
  };

  const newAccessToken = this.jwtService.sign(payload, {
    expiresIn: '60s',
  });

  return {
    access_token: newAccessToken,
  };
}

}