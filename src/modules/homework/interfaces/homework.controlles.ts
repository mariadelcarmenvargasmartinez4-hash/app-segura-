import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { HomeworkService } from './homework.service';

@Controller('api/homework')
export class HomeworkController {

    constructor(
        private readonly homeworkSvc: HomeworkService
    ) {}

    // LISTAR
    @Get()
    getAllHomework(): string {
        return this.homeworkSvc.getAllHomework();
    }

    // CREAR
    @Post()
    createHomework(): string {
        return this.homeworkSvc.createHomework();
    }

    // ACTUALIZAR
    @Put()
    updateHomework(): string {
        return this.homeworkSvc.updateHomework();
    }

    // ELIMINAR
    @Delete()
    deleteHomework(): string {
        return this.homeworkSvc.deleteHomework();
    }
}
