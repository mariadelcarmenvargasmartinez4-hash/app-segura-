import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class UpdateTaskDto {

  // NOMBRE
  @IsOptional()

  @IsString({
    message: 'El nombre debe ser texto'
  })

  @MinLength(5, {
    message: 'El nombre debe tener mínimo 5 caracteres'
  })

  @MaxLength(40, {
    message: 'El nombre no puede superar 40 caracteres'
  })

  @Matches(
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
    {
      message:
        'El nombre solo permite letras y un espacio entre palabras'
    }
  )
  name?: string;

  // DESCRIPCIÓN
  @IsOptional()

  @IsString({
    message: 'La descripción debe ser texto'
  })

  @MinLength(10, {
    message: 'La descripción debe tener mínimo 10 caracteres'
  })

  @MaxLength(150, {
    message: 'La descripción no puede superar 150 caracteres'
  })

  @Matches(
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9]+( [A-Za-zÁÉÍÓÚáéíóúÑñ0-9.,:;()\-]+)*$/,
    {
      message:
        'La descripción no permite espacios dobles ni espacios al inicio/final'
    }
  )
  description?: string;

  // PRIORIDAD
  @IsOptional()

  @IsBoolean({
    message: 'La prioridad debe ser true o false'
  })
  priority?: boolean;
}