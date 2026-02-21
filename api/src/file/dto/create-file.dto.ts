import { IsInt, IsString } from "class-validator";

export class CreateFileDto {
    
    @IsString()
    name: string;

    @IsString()
    content: string;

    @IsInt()
    folderId: number | null;        // not all files need to be in a folder
}