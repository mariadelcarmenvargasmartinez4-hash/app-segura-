import { 
  Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe, 
  HttpException, HttpStatus, NotFoundException 
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guardas';
import type { Request } from 'express'; 
import { Req } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { LogsService } from '../../common/services/logs.service';

@Controller('api/task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly logsService: LogsService
  ) {}


  // Listar todas las tareas
  @Get()
  public async getAllTasks(): Promise<Task[]> {
    try {
      return await this.taskService.getAllTasks();
    } catch (error) {
      throw new HttpException('Failed to fetch tasks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // AGREGADO (filtrar por usuario logueado)
@Get('me')
@UseGuards(AuthGuard)
getMyTasks(@Req() req) {
  return this.taskService.getTasksByUser(req.user.id);
}
  


  // Obtener tarea por ID
  // MODIFICACIÓN: SE AGREGÓ VALIDACIÓN DE PROPIETARIO (IDOR)
  @Get(':id')
@UseGuards(AuthGuard)
public async getTaskById(
  @Param('id', ParseIntPipe) id: number,
  @Req() req
): Promise<Task> {

  const task = await this.taskService.getTaskById(id);

  if (!task) {
    throw new NotFoundException('Tarea no encontrada');
  }

  //  VALIDACIÓN IDOR
  if (task.user_id !== req.user.id) {
    throw new ForbiddenException('No autorizado');
  }

  return task;
}

 @Post()
@UseGuards(AuthGuard)
public async createTask(
  @Req() req,
  @Body() taskData: CreateTaskDto
): Promise<Task> {
  try {
    const task = await this.taskService.createTask({
      ...taskData,
      user_id: req.user.id,
    });

    //  LOG EXITOSO
    await this.logsService.createLog({
      statusCode: 201,
      path: '/api/task',
      error: 'Tarea creada',
      errorCode: 'TASK_CREATED',
      userId: req.user.id,
    });

    return task;

  } catch (error: any) {

    //  LOG ERROR
    await this.logsService.createLog({
      statusCode: 500,
      path: '/api/task',
      error: error.message,
      errorCode: 'CREATE_ERROR',
      userId: req.user?.id,
    });

    throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  @Put(':id')
@UseGuards(AuthGuard)
public async updateTask(
  @Param('id', ParseIntPipe) id: number,
  @Body() taskData: UpdateTaskDto,
  @Req() req
): Promise<Task> {

  const task = await this.taskService.getTaskById(id);

  if (!task) {
    throw new NotFoundException('Tarea no encontrada');
  }

  //  IDOR
  if (task.user_id !== req.user.id) {
    throw new ForbiddenException('No autorizado');
  }

  //  ACTUALIZAR
  const updatedTask = await this.taskService.updateTask(id, taskData);

  //  LOG (AQUÍ VA)
  await this.logsService.createLog({
    statusCode: 200,
    path: 'task/update',
    error: 'Tarea actualizada',
    errorCode: 'TASK_UPDATED',
    userId: req.user.id, //  ID del usuario que hizo la actualización
  });

  return updatedTask;
}

  // Eliminar tarea
 @Delete(':id')
@UseGuards(AuthGuard)
async deleteTask(
  @Param('id', ParseIntPipe) id: number,
  @Req() req
) {
  try {
    const task = await this.taskService.getTaskById(id);

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    if (task.user_id !== req.user.id) {
      throw new ForbiddenException('No autorizado');
    }

    await this.taskService.deleteTask(id);

    //  LOG OK
    await this.logsService.createLog({
      statusCode: 200,
      path: `/api/task/${id}`,
      error: 'DELETE TASK',
      errorCode: 'TASK_DELETED',
      userId: req.user.id,
    });

    return { message: 'Eliminado' };

  } catch (error: any) {

    //  LOG ERROR
    await this.logsService.createLog({
      statusCode: 400,
      path: `/api/task/${id}`,
      error: error.message,
      errorCode: 'DELETE_ERROR',
      userId: req.user?.id,
    });

    throw error;
  }
}
}