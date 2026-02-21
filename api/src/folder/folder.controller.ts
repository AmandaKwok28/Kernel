import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { FolderService } from "./folder.services";
import { Folder } from "./entity/folder.entity";
import { CreateFolderDto } from "./dto/create-folder.dto";
import { UpdateFolderDto } from "./dto/update-folder.dto";

@Controller('folders')
export class FolderController {
    constructor(private readonly folderService: FolderService) {}

    @Get()
    findAll(): Promise<Folder[]> {
        return this.folderService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Folder> {
        return this.folderService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateFolderDto): Promise<Folder> {
        return this.folderService.create(dto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFolderDto): Promise<Folder> {
        return this.folderService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.folderService.remove(id);
    }

}