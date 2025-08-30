import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsEmail({}, { message: 'Email inválido' })
    @MaxLength(100)
    email: string;

    @IsString()
    @MinLength(4, { message: 'Senha muito curta. Deve ter pelo menos 4 caracteres.' })
    @MaxLength(100)
    password: string;
}
