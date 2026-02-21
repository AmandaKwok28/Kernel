import { InjectRepository } from "@nestjs/typeorm";
import { Folder } from "src/folder/entity/folder.entity";
import { File } from "src/file/entity/file.entity";
import { CreateFileDto } from "src/file/dto/create-file.dto";
import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateFileDto } from "./dto/update-file.dto";
import { PaginationResult } from "src/types/pagination";

@Injectable()
export class FileService {
    
    constructor(
        @InjectRepository(File)
        private fileRepository: Repository<File>,

        @InjectRepository(Folder)
        private folderRepository: Repository<Folder>
    ) {}

    // fetch all files
    async findAll(page: number = 1, limit: number = 20): Promise<PaginationResult<File>> {
        const [data, total] = await this.fileRepository.findAndCount({
            relations: ['folder'],                                          // tells typeORM to also return the corresponding folders
            skip: (page - 1) * limit,                                       // this is the offset for page indexing. it's page - 1 because we're 0 indexed not 1 indexed
            take: limit,                                                    // indicates number of rows max
            order: { created_at: 'DESC' }                                   // descending by creation date
        });

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        };
    };

    // get by id
    async findOne(id: number): Promise<File> {

        const file = await this.fileRepository.findOne({
            where: { id }
        });

        if (!file) {
            throw new NotFoundException('File not found.');
        }

        return file;
    };

    // create a new file
    async create(createFileDto: CreateFileDto): Promise<File> {

        const { name, content, folderId } = createFileDto;
        let folder: Folder | undefined = undefined;
        
        // if a folder is specified, retrieve it
        if (folderId != null) {
            folder = await this.folderRepository.findOne({
                where: { id: folderId },
            }) ?? undefined;

            if (!folder) {
                throw new NotFoundException('File not found.');
            }
        }
        
        const file = this.fileRepository.create({
            name,
            content,
            folder,                                     // this connects the relationship
        })

        return this.fileRepository.save(file);          // tells the ORM to persist this entity to the database
    }


    // update an existing file
    async update(id: number, dto: UpdateFileDto): Promise<File> {
        
        const file = await this.fileRepository.findOneBy({ id });

        if (!file) {
            throw new NotFoundException('File not found.');
        }

        if (
            dto.name == undefined &&
            dto.content == undefined && 
            dto.folderId == undefined
        ) {
            throw new Error('At least one filed must be provided');
        }

        // copies properties from the src to the target: Object.assign(target, src)
        Object.assign(file, dto);

        return this.fileRepository.save(file);

    };

    async remove(id: number): Promise<void> {

        const res = await this.fileRepository.delete(id);

        if (res.affected === 0) {
            throw new NotFoundException('File not found.');
        }
    };

}