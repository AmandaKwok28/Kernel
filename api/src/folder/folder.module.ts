import { Module } from "@nestjs/common";
import { FolderController } from "./folder.controller";
import { FolderService } from "./folder.services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Folder } from "./entity/folder.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Folder])],
    controllers: [FolderController],
    providers: [FolderService],
})

export class FolderModule {};