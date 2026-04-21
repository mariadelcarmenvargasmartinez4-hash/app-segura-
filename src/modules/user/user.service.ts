import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { UtilService } from '../../common/services/util.services';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {

  constructor(
  private readonly prisma: PrismaService,
  private readonly utilSvc: UtilService, 
) {}

async getAllUsers(): Promise<any[]> {
  const users = await this.prisma.user.findMany();
  
return users.map(u => ({
  id: u.id,
  name: u.name,
  lastname: u.lastname,
  username: u.username
}));
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

  //  AGREGADO (para login)
  async getUserByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username }
    });
  }

  //  ALIAS para tu controller (insertUser)
  async insertUser(data: CreateUserDto): Promise<User> {
    return this.createUser(data);
  }

  //método original (lo mantenemos)
  async createUser(data: CreateUserDto): Promise<User> {
    const hashed = await this.utilSvc.hashPassword(data.password);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashed,
      },
    });
  }

  async updateUser(id: number, data: UpdateUserDto | any): Promise<User> {
    try {
      if (data.password) {
        data.password = await this.utilSvc.hashPassword(data.password);
      }

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
  async getTasksByUser(userId: number) {
  return this.prisma.task.findMany({
    where: { user_id: userId }
  });
}

  //  AGREGADO (para validar tareas antes de borrar)
  async getTasksByUserId(userId: number) {
    return this.prisma.task.findMany({
      where: { user_id: userId }
    });
  }
  
}