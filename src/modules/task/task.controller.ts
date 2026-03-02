import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('api/task')
export class TaskController {
  constructor(private taskSvc: TaskService) {}

  @Get()
  @Get(':id')
  public listTaskById(@Param("id", parseIntPipe) id: String): promise<Talk>{
    const result = await this.taskSvc.getTaskById(parseInt(id));
    
    if (result == undefined) 
      throw new HttpException('Tarea con ID ${id }no encontrada', HttpStatus.NOT_FOUND);
    return result
  }

  @Post()
  public async insertTask(@Body() task: CreateTaskDto): Promise<Task> {
    const result = this.taskSvc.insertTask(task);
    if (result == undefined)
      throw new HttpException('tarea no registrda', HttpStatus.INTERNAL_SERVER_ERROR);
   
    return result;
  }

  @Delete(':id')
  public deleteTask(@Param("id", ParseIntPipe) id: number): promise<boolean> {
    const result = await this.taskSvc.deleteTask(id);
    if (!result)
      throw new HttpException('tarea con ID ${id} no encontrada', HttpStatus.NOT_FOUND);
    return result;
  }

  @Put(":id")
  public async updatetalk(@Param("id", ParseIntPipe) id: number , @Body() task: UpdateTaskDto): Promise<any> {
    return this.taskSvc.updatetalk(id, task);
  }

  @Get(':id')
  public async listTaskById(@Param('id') id: String): Promise<any> {
    const result = await this.taskSvc.listTaskById(parseInt(id));

    if (result == undefined) 
      throw new HttpException('Tarea con ID ${id }no encontrada', HttpStatus.NOT_FOUND);
    return this.taskSvc.listarTalkById(Number(id));
  }
}
