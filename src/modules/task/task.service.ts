import { Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { takeLast } from 'rxjs/internal/operators/takeLast';

@Injectable()
export class TaskService {
  public getTaskById(id: number): string {
    return `listado de tareas con id: ${id}`;
  }
  public insertTask(task: any): Promise<any> {
    const  sql = 'INSERT INTO tasks 
    (name, description, priority,user_id) VALUES ('${task.name}, '${task.description}, ${task.priority}, ${task.user_id  })';
   const [result] = await this.pg.query(sql);
    return Promise.resolve(task);
  }


  public async updatetalk(id: number, taskUpdate: UpdateTaskDto):Promise<talk> {
    const task = await this.getTaskById(id);
    task.name = taskUpdate.name ?? task.name;
    task.description = taskUpdate.description ?? task.description;
    task.priority = taskUpdate.priority ?? task.priority;
    const query = 'UPDATE tasks SET name = ${task.name}, description = ${task.description}, priority = ${task.priority} WHERE id = ${id}';
    const [result] = await this.pg.query(query);
    return result;
  }
  public deleteTask(id: number): string {
    const query = 'DELETE FROM tasks WHERE id = ${id}';
    const [result] = await this.pg.query(query);
    
    return result.affectedRows > 0 ;
  }
  public async listTaskById(id: number): Promise<talk> {
    const query ='select * from tasks where id = ${id}';
    const [result] = await this.pg.query(query); 

   return result[0] as TaskService;
  }
}
