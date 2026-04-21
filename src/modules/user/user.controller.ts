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

@Controller('api/user')
export class UserController {

  constructor(
    private readonly userService: UserService,
    private readonly userSvc: UserService,
    private readonly logsService: LogsService
  ) {}

  //  GET ALL
  @UseGuards(AuthGuard)
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
  @Post()
  async createUser(
    @Body() data: CreateUserDto
  ): Promise<User> {
    try {
      const user = await this.userService.createUser(data);

      await this.logsService.createLog({
        statusCode: 201,
        path: '/api/user',
        error: 'CREATE USER',
        errorCode: 'SUCCESS',
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
        error: 'UPDATE USER',
        errorCode: 'SUCCESS',
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
  @UseGuards(AuthGuard)
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
        error: 'DELETE USER',
        errorCode: 'SUCCESS',
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