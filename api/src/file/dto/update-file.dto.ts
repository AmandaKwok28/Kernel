import { IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateFileDto {
    @IsOptional()
    @IsString()                     // typescript is transpiled into js at runtime but @IsString will still run so it's not redundant
    name?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsInt()
    folderId?: number | null;
}