import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/common/guards/auth.guardas';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
  ) {
    return this.authService.login(body.username, body.password);
  }

  @Post('refresh')
  async refresh(
    @Body() body: { refreshToken: string },
  ) {
    return this.authService.refresh(body.refreshToken);
  }

  // 🔒 Endpoint de prueba para validar guard
  @UseGuards(AuthGuard)
  @Post('me')
  getProfile(@Req() req: any) {
    return req.user;
  }
}