import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateUserDto {

  // NOMBRE
  @IsString({
    message: 'El nombre debe ser texto'
  })

  @IsNotEmpty({
    message: 'El nombre es obligatorio'
  })

  @MinLength(3, {
    message: 'El nombre debe tener mínimo 3 caracteres'
  })

  @MaxLength(50, {
    message: 'El nombre no puede superar 50 caracteres'
  })

  @Matches(
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
    {
      message:
        'El nombre solo permite letras y un espacio entre palabras'
    }
  )
  name!: string;

  // APELLIDO
  @IsString({
    message: 'El apellido debe ser texto'
  })

  @IsNotEmpty({
    message: 'El apellido es obligatorio'
  })

  @MinLength(3, {
    message: 'El apellido debe tener mínimo 3 caracteres'
  })

  @MaxLength(50, {
    message: 'El apellido no puede superar 50 caracteres'
  })

  @Matches(
    /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/,
    {
      message:
        'El apellido solo permite letras y un espacio entre palabras'
    }
  )
  lastname!: string;

  // USERNAME
  @IsString({
    message: 'El usuario debe ser texto'
  })

  @IsNotEmpty({
    message: 'El usuario es obligatorio'
  })

  @MinLength(5, {
    message: 'El usuario debe tener mínimo 5 caracteres'
  })

  @MaxLength(20, {
    message: 'El usuario no puede superar 20 caracteres'
  })

  @Matches(/^[A-Za-z0-9]+$/, {
    message:
      'El usuario solo permite letras y números sin espacios'
  })
  username!: string;

  // PASSWORD
  @IsString({
    message: 'La contraseña debe ser texto'
  })

  @IsNotEmpty({
    message: 'La contraseña es obligatoria'
  })

  @MinLength(8, {
    message: 'La contraseña debe tener mínimo 8 caracteres'
  })

  @MaxLength(20, {
    message: 'La contraseña no puede superar 20 caracteres'
  })

  @Matches(/^\S+$/, {
    message: 'La contraseña no debe contener espacios'
  })

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/,
    {
      message:
        'La contraseña debe tener mayúscula, minúscula, número y símbolo'
    }
  )
  password!: string;

  // ROLE
  @IsOptional()

  @IsString({
    message: 'El rol debe ser texto'
  })

  @IsIn(['ADMIN', 'USER'], {
    message: 'Rol inválido'
  })
  role?: string;
}