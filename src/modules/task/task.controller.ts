import { 
  Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe, 
  HttpException, HttpStatus, NotFoundException 
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

@Controller('api/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Listar todas las tareas
  @Get()
  public async getAllTasks(): Promise<Task[]> {
    try {
      return await this.taskService.getAllTasks();
    } catch (error) {
      throw new HttpException('Failed to fetch tasks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Obtener tarea por ID
  @Get(':id')
  public async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    try {
      const task = await this.taskService.getTaskById(id);
      // Aseguramos que task siempre exista
      if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
      return task;
    } catch (error) {
      // Convertimos cualquier error a 404 si es NotFoundException
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Task with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
  }

  // Crear tarea
  @Post()
public async createTask(@Body() taskData: CreateTaskDto): Promise<Task> {
  try {
    console.log(taskData);
    return await this.taskService.createTask(taskData);
  } catch (error) {
    console.log(error);
    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  // Actualizar tarea
  @Put(':id')
  public async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() taskData: UpdateTaskDto,
  ): Promise<Task> {
    try {
      const task = await this.taskService.updateTask(id, taskData);
      if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(`Task with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
  }

  // Eliminar tarea
  @Delete(':id')
  public async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    try {
      await this.taskService.deleteTask(id);
      return true;
    } catch (error) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
  }
}