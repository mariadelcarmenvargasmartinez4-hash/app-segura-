import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt} from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {
    super({
      // CAMBIO AQUÍ: Extraer de la cookie en lugar de Authentication Header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['access_token'];
          }
          return token || ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'TU_JWT_SECRET', // Asegúrate que sea el mismo del Login
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username }; // Puedes retornar lo que necesites en el request.user
  }

}