
import {Body,Controller,Post,Get,Patch,Delete,Param,ParseIntPipe,HttpException,HttpStatus,UseGuards, ForbiddenException, HttpCode} from '@nestjs/common';

import { AuthGuard } from 'src/common/guards/auth.guardas'; 

import { UserService } from '../user/user.service';
import { UtilService } from 'src/common/services/util.services';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from '@prisma/client';
import { get } from 'node:http';


@Controller('api/auth')
@UseGuards(AuthGuard)
export class AuthController {

  constructor(
    private readonly userSvc: UserService,
    private readonly utilSvc: UtilService
  ) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userSvc.getAllUsers();
  }

  @Get{"/me"}
  @UseGuards(AuthGuard)
  public getProfile(@Request() request: any) {
  } 

  @Post{"/refresh"}
  @UseGuards(AuthGuard)
  public refreshToken(@Req() request: any) {
    //obtener el ususrio en sesion
    const sessionUser = request ['user'];
    cosnt user = await this.userSvc.getUserById(sessionUser.id);
    if(!user || !user.hash) throw new ForbiddenException("Token invalido");{ 

    const user = request.user;
    //comparrar el token recibidos con el token guardado
    // si el token es valido se genere nuevos token 
  }


  //1 http://localhost:3000/api/User/1
  @Get(":id")
  public async listUserById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<User> {

    const result = await this.userSvc.getUserById(id);
    const hash = await this.utilSvc.hashPassword(refreshToken);//hash del refresh token
    //return refrsh_token: hash

    if (result == undefined) {
      throw new HttpException(
        `Usuario con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND
      );
    }

    return result;
  }

  @Post()
  public async insertUser(
    @Body() user: CreateUserDto
  ): Promise<User> {

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

    if (result == undefined) {
      throw new HttpException(
        "Usuario no registrado",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return result;
  }

  @Patch(":id")
  public async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() user: UpdateUserDto
  ): Promise<User> {

    const currentUser = await this.userSvc.getUserById(id);

    if (currentUser == undefined) {
      throw new HttpException(
        `Usuario con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND
      );
    }

    return await this.userSvc.updateUser(id, user);
  }

  @Delete(":id")
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

  @Post{"/logout"}
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() request: any) {
    const sessionUser = request ['user'];
    await this.userSvc.updateUser(sessionUser.id, { hash: null });
  } 
}

