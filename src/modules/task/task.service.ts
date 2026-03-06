import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  // Listar todas las tareas
  public async getAllTasks(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    return tasks;
  }

  // Obtener tarea por ID
  public async getTaskById(id: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
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
    const task = await this.prisma.task.update({
      where: { id },
      data,
    });
    return task;
  }

  // Eliminar tarea
  public async deleteTask(id: number): Promise<Task> {
    const task = await this.prisma.task.delete({
      where: { id },
    });
    return task;
  }
}