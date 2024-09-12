import { IsString, IsNotEmpty, IsEmail, IsOptional, IsInt, MinLength } from 'class-validator';

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsInt()
    @IsNotEmpty()
    age: number;

    @IsString()
    @IsOptional()
    roles?: string = 'user';
}
