import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateNoteDto {

    @IsString()
    @MinLength(3)
    @MaxLength(500)
    title: string;

    @IsString()
    @MinLength(2)
    code: string;

    @IsString()
    language: string;

}
