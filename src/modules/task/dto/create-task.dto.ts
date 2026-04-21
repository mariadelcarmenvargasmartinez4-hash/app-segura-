import { IsBoolean, IsIn, IsInt, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(250)
    description!: string;

    @IsNotEmpty()
    @IsBoolean()
    priority!: boolean; 

    @IsInt()
    user_id!: number;

}