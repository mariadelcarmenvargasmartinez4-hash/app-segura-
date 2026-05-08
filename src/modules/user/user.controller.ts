import {
  Body, Controller, Delete, Get, Param, Post, Put,
  ParseIntPipe, UseGuards, Req
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { AuthGuard } from '../../common/guards/auth.guardas';
import { LogsService } from '../../common/services/logs.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('api/user')
export class UserController {

  constructor(
    private readonly userService: UserService,
    private readonly userSvc: UserService,
    private readonly logsService: LogsService
  ) {}

  //  GET ALL
  @UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Get()
  public async getAllUsers(@Req() req): Promise<any[]> {
    try {
      const users = await this.userSvc.getAllUsers();

      await this.logsService.createLog({
        statusCode: 200,
        path: '/api/user',
        error: 'GET USERS',
        errorCode: 'SUCCESS',
        userId: req.user?.id,
      });

      return users;

    } catch (error: any) {

      await this.logsService.createLog({
        statusCode: 500,
        path: '/api/user',
        error: error.message,
        errorCode: 'GET_USERS_ERROR',
        userId: req.user?.id,
      });

      throw error;
    }
  }

  //  GET BY ID
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<User> {
    try {
      const user = await this.userService.getUserById(id);

      await this.logsService.createLog({
        statusCode: 200,
        path: `/api/user/${id}`,
        error: 'GET USER',
        errorCode: 'SUCCESS',
        userId: req.user?.id,
      });

      return user;

    } catch (error: any) {

      await this.logsService.createLog({
        statusCode: 500,
        path: `/api/user/${id}`,
        error: error.message,
        errorCode: 'GET_USER_ERROR',
        userId: req.user?.id,
      });

      throw error;
    }
  }

  //  CREATE
  @UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Post()
  async createUser(
    @Body() data: CreateUserDto
  ): Promise<User> {
    try {
      const user = await this.userService.createUser(data);

      await this.logsService.createLog({
        statusCode: 201,
        path: '/api/user',
        error: 'Usuario creado',
        errorCode: 'USER_CREATED',
      });

      return user;

    } catch (error: any) {

      await this.logsService.createLog({
        statusCode: 500,
        path: '/api/user',
        error: error.message,
        errorCode: 'CREATE_USER_ERROR',
      });

      throw error;
    }
  }

  //  UPDATE
  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
    @Req() req
  ): Promise<User> {
    try {
      const user = await this.userService.updateUser(id, data);

      await this.logsService.createLog({
        statusCode: 200,
        path: `/api/user/${id}`,
        error: 'Usuario actualizado',
        errorCode: 'UPDATE_USER',
        userId: req.user?.id,
      });

      return user;

    } catch (error: any) {

      await this.logsService.createLog({
        statusCode: 500,
        path: `/api/user/${id}`,
        error: error.message,
        errorCode: 'UPDATE_USER_ERROR',
        userId: req.user?.id,
      });

      throw error;
    }
  }

  //  DELETE
  @UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<User> {
    try {
      const user = await this.userService.deleteUser(id);

      await this.logsService.createLog({
        statusCode: 200,
        path: `/api/user/${id}`,
        error: 'Usuario eliminado',
        errorCode: 'USER_DELETED',
        userId: req.user?.id,
      });

      return user;

    } catch (error: any) {

      await this.logsService.createLog({
        statusCode: 400,
        path: `/api/user/${id}`,
        error: error.message,
        errorCode: 'DELETE_USER_ERROR',
        userId: req.user?.id,
      });

      throw error;
    }
  }
}