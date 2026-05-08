import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateTaskDto {

  // NOMBRE
  @IsString({ message: 'El nombre debe ser texto' })

  @IsNotEmpty({ message: 'El nombre es obligatorio' })

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
  name!: string;

  // DESCRIPCIÓN
  @IsString({ message: 'La descripción debe ser texto' })

  @IsNotEmpty({ message: 'La descripción es obligatoria' })

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
  description!: string;

  // PRIORIDAD
  @IsBoolean({
    message: 'La prioridad debe ser verdadera o falsa'
  })
  priority!: boolean;

  // USER ID
  @IsInt({
    message: 'El usuario debe ser válido'
  })
  user_id!: number;
}