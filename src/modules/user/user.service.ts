import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        tasks: true
      }
    });
  }

  async getUserById(id: number): Promise<User> {

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { tasks: true }
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data
    });
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {

    try {
      return await this.prisma.user.update({
        where: { id },
        data
      });

    } catch {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async deleteUser(id: number): Promise<User> {

    try {
      return await this.prisma.user.delete({
        where: { id }
      });

    } catch {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}