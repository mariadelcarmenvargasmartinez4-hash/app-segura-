import { isBoolean, MaxLength } from "class-validator";

export class UpdateTaskDto {



    @IsOptional()
    @IsString({ message: 'debe ser tipo cadena ' })
    @MinLength(3, { message: 'debe de tener al menos 3 caracteres' })
    @MaxLength(100)
    name: string;
    @IsOptional()
    description: string;
    @IsOptional()
    @isBoolean()
    priority: boolean;

}