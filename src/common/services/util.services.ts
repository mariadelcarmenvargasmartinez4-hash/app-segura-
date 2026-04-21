import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UtilService {

  constructor(private readonly jwtSvc: JwtService) {}    

  // Encriptar contraseña o token
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // Comparar contraseña
  public async checkPassword(password: string, encryptedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, encryptedPassword);
  }

  // Generar JWT (base)
  public async generateJWT(payload: any, expiresIn: any = '60s'): Promise<string> {
    return await this.jwtSvc.signAsync(payload, { expiresIn });
  }

  // Obtener payload del token
  public async getPayload(token: string): Promise<any> {
    return await this.jwtSvc.verifyAsync(token);
  }

  
  // Correcion de mi controller para usar el hash del refresh token
  

  //  checkPassword
  public async compareHash(password: string, hash: string): Promise<boolean> {
    return this.checkPassword(password, hash);
  }

  //  generateJWT
  public async generateToken(payload: any, expiresIn: any = '60s'): Promise<string> {
    return this.generateJWT(payload, expiresIn);
  }
}

