import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  name !: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(300)
  lastname !: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  username !: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
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