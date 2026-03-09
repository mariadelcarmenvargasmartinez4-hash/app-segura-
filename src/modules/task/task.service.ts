import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client'; // cambiar a Task de Prisma para incluir user_id

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  // Listar todas las tareas
  public async getAllTasks(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    return tasks;
  }

  // Obtener tarea por ID
  public async getTaskById(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  // Insertar nueva tarea
  public async createTask(data: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({
      data,
    });
    return task;
  }

  // Actualizar tarea
  public async updateTask(id: number, data: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.prisma.task.update({
        where: { id },
        data,
      });
      return task;
    } catch (error: any) {
      if (error.code === 'P2025') { // Prisma error: registro no encontrado
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }

  // Eliminar tarea
  public async deleteTask(id: number): Promise<Task> {
    try {
      const task = await this.prisma.task.delete({
        where: { id },
      });
      return task;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      throw error;
    }
  }
}