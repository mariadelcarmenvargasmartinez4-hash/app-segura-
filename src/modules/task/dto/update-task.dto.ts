import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTaskDto {

  @IsOptional()
  @IsString({ message: 'debe ser tipo cadena' })
  @MinLength(3, { message: 'debe tener al menos 3 caracteres' })
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString({ message: 'debe ser tipo cadena' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'debe ser booleano (true o false)' })
  priority?: boolean;

}