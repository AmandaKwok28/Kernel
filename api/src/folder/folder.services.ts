import { Injectable, NotFoundException } from "@nestjs/common";
import { Folder } from "./entity/folder.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFolderDto } from "./dto/create-folder.dto";
import { UpdateFolderDto } from "./dto/update-folder.dto";

@Injectable()
export class FolderService {
    constructor(
        @InjectRepository(Folder)
        private folderRepository: Repository<Folder>
    ) {}

    async findAll(): Promise<Folder[]> {
        return this.folderRepository.find();
    }

    async findOne(id: number): Promise<Folder> {
        const folder = await this.folderRepository.findOneBy({ id });

        if (!folder) {
            throw new NotFoundException('Folder not Found');
        }

        return folder;
    }

    async create(dto: CreateFolderDto): Promise<Folder> {

        const folder = await this.folderRepository.create(dto);
        return this.folderRepository.save(folder);
    }

    async update(id: number, dto: UpdateFolderDto): Promise<Folder> {

        const folder = await this.folderRepository.findOneBy({ id });
        if (!folder) {
            throw new NotFoundException('Folder not Found');
        }

        Object.assign(folder, dto);
        return this.folderRepository.save(folder);
    }

    async remove(id: number): Promise<void> {
        const res = await this.folderRepository.delete(id);

        if (res.affected === 0) {
            throw new NotFoundException('Folder not Found');
        }
    }
}