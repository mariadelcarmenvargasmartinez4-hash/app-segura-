import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeworkService {

    // LISTAR
    getAllHomework(): string {
        return 'Lista de homework obtenida correctamente';
    }

    // CREAR
    createHomework(): string {
        return 'Homework creado correctamente';
    }

    // ACTUALIZAR
    updateHomework(): string {
        return 'Homework actualizado correctamente';
    }

    // ELIMINAR
    deleteHomework(): string {
        return 'Homework eliminado correctamente';
    }
}
