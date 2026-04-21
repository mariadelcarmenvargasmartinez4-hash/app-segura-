
import {
  Body, Controller, Post, Get, Patch, Delete, Param,
  ParseIntPipe, HttpException, HttpStatus, UseGuards,
  ForbiddenException, HttpCode, Req, Request, Res
} from '@nestjs/common';

//import { AuthGuard } from 'src/common/guards/auth.guardas';
import { AuthGuard } from '../../common/guards/auth.guardas';
import { UtilService } from '../../common/services/util.services';
import { UserService } from '../user/user.service';
//import { UtilService } from 'src/common/services/util.services';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from '@prisma/client';
import { Throttle } from '@nestjs/throttler/dist/throttler.decorator';
import { LogsService } from '../../common/services/logs.service';


@Controller('api/auth') 
// MODIFICACIÓN: SE ELIMINÓ @UseGuards(AuthGuard) GLOBAL
export class AuthController {

  constructor(
    private readonly userSvc: UserService,
    private readonly utilSvc: UtilService,
    private readonly logsService: LogsService
  ) {}

  
  // LOGIN (PUBLICO)
  @Post('/login')
@Throttle({ default: { limit: 5, ttl: 60 } })
public async login(@Body() body: any, @Res({ passthrough: true }) response: any) {

  const { username, password } = body;

  try {
    const user = await this.userSvc.getUserByUsername(username);

    if (!user) {
      await this.logsService.createLog({
        statusCode: 404,
        path: 'auth/login',
        error: 'Usuario no encontrado',
        errorCode: 'USER_NOT_FOUND',
      });

      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const isMatch = await this.utilSvc.checkPassword(password, user.password);

    if (!isMatch) {
      await this.logsService.createLog({
        statusCode: 401,
        path: 'auth/login',
        error: 'Contraseña incorrecta',
        errorCode: 'INVALID_PASSWORD',
        userId: user.id,
      });

      throw new HttpException('Contraseña incorrecta', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user.id, username: user.username , role: user.role,}; //  modificación: se agregó el campo role al payload};

    const accessToken = await this.utilSvc.generateJWT(payload, '15m');
    const refreshToken = await this.utilSvc.generateJWT(payload, '7d');

    const hash = await this.utilSvc.hashPassword(refreshToken);
    await this.userSvc.updateUser(user.id, { hash });

    // LOG EXITOSO
    await this.logsService.createLog({
      statusCode: 200,
      path: 'auth/login',
      error: 'Login exitoso',
      errorCode: 'SUCCESS',
      userId: user.id,
    });

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    return {
      accessToken,
      refreshToken,
      message: 'ok'
    };

  } catch (error: any) {

    await this.logsService.createLog({
      statusCode: error.status || 500,
      path: 'auth/login',
      error: error.message,
      errorCode: 'SERVER_ERROR',
    });

    throw error;
  }
}
  
  //  PERFIL (PROTEGIDO)
  
  @Get('/me')
  @UseGuards(AuthGuard) //PROTEGIDO
  public getProfile(@Request() request: any) {
    return {
  id: request.user.id,
  username: request.user.username,
  role: request.user.role, //  modificación: se agregó el campo role al perfil
};
  }

  
  //  REFRESH TOKEN
  
  @Post('/refresh')
  @UseGuards(AuthGuard) // PROTEGIDO
  public async refreshToken(@Req() request: any) {

    const sessionUser = request['user'];

    const user = await this.userSvc.getUserById(sessionUser.id);

    if (!user || !user.hash) {
      throw new ForbiddenException("Token invalido");
    }

    const refreshToken = request.headers['authorization']?.replace('Bearer ', '');

    if (!refreshToken) {
      throw new ForbiddenException("Refresh token requerido");
    }

    const isMatch = await this.utilSvc.compareHash(refreshToken, user.hash);

    if (!isMatch) {
      throw new ForbiddenException("Token invalido");
    }

    const newAccessToken = await this.utilSvc.generateToken({ id: user.id }, '60s');
    const newRefreshToken = await this.utilSvc.generateToken({ id: user.id }, '7d');

    const newHash = await this.utilSvc.hashPassword(newRefreshToken);
    await this.userSvc.updateUser(user.id, { hash: newHash });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  
  //  USUARIOS (PROTEGIDO)
  
  @Get()
  @UseGuards(AuthGuard) //PROTEGIDO
  async getAllUsers(): Promise<User[]> {
    return await this.userSvc.getAllUsers();
  }

  @Get(":id")
  @UseGuards(AuthGuard) // PROTEGIDO
  public async listUserById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<User> {

    const result = await this.userSvc.getUserById(id);

    if (!result) {
      throw new HttpException(
        `Usuario con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND
      );
    }

    return result;
  }

  
  //  REGISTRO (PUBLICO)
  
  @Post()
  // SIN GUARD 
  @Post()
public async insertUser(
  @Body() user: CreateUserDto
): Promise<any> {

  const currentUser = await this.userSvc.getUserByUsername(user.username);

  if (currentUser) {
    throw new HttpException(
      "Nombre de usuario no disponible",
      HttpStatus.CONFLICT
    );
  }

  const encryptedPassword = await this.utilSvc.hashPassword(user.password);
  user.password = encryptedPassword;

  const result = await this.userSvc.insertUser(user);

  if (!result) {
    throw new HttpException(
      "Usuario no registrado",
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  //  MODIFICACIÓN AQUÍ PARA NO RETORNAR EL HASH DEL REFRESH TOKEN
  return {
    id: result.id,
    username: result.username,
    name: result.name,
    lastname: result.lastname
  };
}

  
  // UPDATE
  
  @Patch(":id")
  @UseGuards(AuthGuard) // PROTEGIDO
  public async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() user: UpdateUserDto
  ): Promise<User> {

    const currentUser = await this.userSvc.getUserById(id);

    if (!currentUser) {
      throw new HttpException(
        `Usuario con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND
      );
    }

    return await this.userSvc.updateUser(id, user);
  }

  
  // DELETE
  
  @Delete(":id")
  @UseGuards(AuthGuard) // PROTEGIDO
  public async deleteUser(
    @Param("id", ParseIntPipe) id: number
  ): Promise<boolean> {

    const tasks = await this.userSvc.getTasksByUserId(id);

    if (tasks.length > 0) {
      throw new HttpException(
        "The user has tasks",
        HttpStatus.CONFLICT
      );
    }

    const result = await this.userSvc.deleteUser(id);

    if (!result) {
      throw new HttpException(
        "User not found",
        HttpStatus.NOT_FOUND
      );
    }

    return true;
  }

  
  // LOGOUT
  
  @Post("/logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard) // PROTEGIDO
  public async logout(@Req() request: any) {
    const sessionUser = request['user'];
    await this.userSvc.updateUser(sessionUser.id, { hash: null });
  }
}