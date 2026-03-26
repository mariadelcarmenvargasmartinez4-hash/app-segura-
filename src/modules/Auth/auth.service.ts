
import { Injectable, UnauthorizedException } from '@nestjs/common';
//import { UserService } from '../user/user.service';
import { UtilService } from 'src/common/services/util.services';
import { PrismaService } from 'src/common/services/prisma.service';
///

import { User } from '@prisma/client';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class AuthService{

  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  

  //  ESTE ES EL QUE TE FALTA
  async getUserByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username }
    });
  }

  //  ESTE TAMBIÉN
  async insertUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        lastname: data.lastname,
        username: data.username,
        password: data.password
      }
    });
  }

  async updateUser(id: number, data: any): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data //  permite refreshToken
      }
    });
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }

  //  ESTE TAMBIÉN TE FALTA
  async getTasksByUserId(userId: number) {
    return this.prisma.task.findMany({
      where: { user_id: userId }
    });
  }

 public async getUserById(id: number): Promise<User | null> {
  return await this.prisma.user.findFirst({
    where: { id }
  });
}

public async updateHash(id: number, hash: string): Promise<User> {
  return await this.prisma.user.update({
    where: { id }, // corregido
    data: { hash }
  });
}
}