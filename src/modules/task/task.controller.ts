import { Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe, HttpException } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('api/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(@Body() task: CreateTaskDto) {
    return this.taskService.createTask(task);
  }

  @Get()
  async getAllTasks() {
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  async getTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.taskService.getTaskById(id);
  }

  @Put(':id')
  async updateTask(@Param('id', ParseIntPipe) id: number, @Body() task: UpdateTaskDto) {
    return this.taskService.updateTask(id, task);
  }

  @Delete(':id')
  public async deleteTask(@Param('id', ParseIntPipe) id: number) promise<boolean> {
    try {      await this.taskService.deleteTask(id);
    } catch (error){
      throw new HttpException('Task not found', 404);
        }   
    return true;
  }
}