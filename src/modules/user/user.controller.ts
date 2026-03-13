import { Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Controller('api/user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createUser(
    @Body() data: CreateUserDto
  ): Promise<User> {
    return this.userService.createUser(data);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto
  ): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number
  ): Promise<User> {
    return this.userService.deleteUser(id);
  }
}