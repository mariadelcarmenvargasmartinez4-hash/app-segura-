import { IsOptional, IsString, MinLength, MaxLength, Matches } from "class-validator";

export class UpdateUserDto {

  @IsOptional()
  @IsString({ message: 'name debe ser una cadena de texto' })
  @MinLength(2, { message: 'name debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'name no debe exceder 100 caracteres' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'lastname debe ser una cadena de texto' })
  @MinLength(2, { message: 'lastname debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'lastname no debe exceder 100 caracteres' })
  lastname?: string;

  @IsOptional()
  @IsString({ message: 'username debe ser una cadena de texto' })
  @MinLength(3, { message: 'username debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'username no debe exceder 50 caracteres' })
  username?: string;

  @IsOptional()
  @IsString({ message: 'password debe ser una cadena de texto' })
  @MinLength(4, { message: 'password debe tener al menos 4 caracteres' })
  @MaxLength(100, { message: 'password no debe exceder 100 caracteres' })
  @Matches(/^\S+$/, {
    message: 'La contraseña no debe contener espacios'
  })
    @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
    {
      message:
        'La contraseña debe tener mayúscula, minúscula, número y símbolo',
    }
  )
    password !: string;
 

}