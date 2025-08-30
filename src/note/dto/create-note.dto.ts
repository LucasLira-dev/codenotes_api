import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateNoteDto {

    @IsString()
    @MinLength(3)
    @MaxLength(256)
    title: string;

    @IsString()
    @MinLength(5)
    @MaxLength(512)
    code: string;

    @IsString()
    language: string;

}
