import { Controller, Post, Get, Body, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { FileService } from './file.services';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entity/file.entity';

// all routes start with file
@Controller('files')
export class FileController {
    constructor(private readonly fileService: FileService) {}      // inject our file service

    @Get()
    findAll(): Promise<File[]> {
        return this.fileService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<File> {
        return this.fileService.findOne(id)
    };

    // create a new file using the data transfer object
    @Post()
    create(@Body() dto: CreateFileDto): Promise<File> {
        return this.fileService.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() dto: UpdateFileDto
    ): Promise<File> {
        return this.fileService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.fileService.remove(id);
    }

}