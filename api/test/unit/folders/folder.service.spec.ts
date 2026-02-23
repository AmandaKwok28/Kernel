import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateFolderDto } from "src/folder/dto/create-folder.dto";
import { Folder } from "src/folder/entity/folder.entity";
import { FolderService } from "src/folder/folder.services"
import { createMockFolder } from "test/factories/folders";
import { createMockRepository } from "test/utils/mock-repository";
import { DeleteResult } from "typeorm";

describe('FolderService (unit)', () => {

    let service: FolderService;

    let folderRepository: {
        findAndCount: jest.Mock;        
        findOne: jest.Mock;
        findOneBy: jest.Mock;
        create: jest.Mock;
        save: jest.Mock;
        delete: jest.Mock;
        createQueryBuilder: jest.Mock;
        find: jest.Mock;
    };

    beforeEach(async () => {

        folderRepository = createMockRepository();
        const moduelRef = await Test.createTestingModule({
            providers: [
                FolderService,
                { provide: getRepositoryToken(Folder), useValue: folderRepository },
            ],
        }).compile();

        service = moduelRef.get(FolderService);

    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    // testing all services
    describe('findAll', () => {

        it('get all folders', async () => {
            
            const mockFolders = Array.from({ length: 5 }, () => createMockFolder());
            folderRepository.find.mockResolvedValue(mockFolders);
            
            const res = await service.findAll();

            expect(folderRepository.find).toHaveBeenCalled();
            expect(res).toEqual(mockFolders);

        })

    })

    describe('findOne', () => {
        
        it('return folder when found', async() => {

            const mockFolder = createMockFolder({ id: 7 });
            folderRepository.findOneBy.mockResolvedValue(mockFolder)

            const res = await service.findOne(7);

            expect(folderRepository.findOneBy).toHaveBeenCalledWith({ id: 7 });
            expect(res).toEqual(mockFolder);

        })

        it('throws exception when folder not found', async () => {

            folderRepository.findOneBy.mockResolvedValue(null);

            await expect(service.findOne(7)).rejects.toBeInstanceOf(NotFoundException);
            await expect(service.findOne(7)).rejects.toThrow('Folder not Found');        
            expect(folderRepository.findOneBy).toHaveBeenCalled();

        })

    })

    describe('create', () => {

        it('create a new folder', async () => {

            const mockFolder = createMockFolder({ name: 'test folder' });
            const dto: CreateFolderDto ={
                name: 'test folder'
            };

            folderRepository.create.mockReturnValue(mockFolder);
            folderRepository.save.mockResolvedValue(mockFolder);

            const res = await service.create(dto);

            expect(folderRepository.create).toHaveBeenCalledWith(dto);
            expect(folderRepository.save).toHaveBeenCalledWith(mockFolder);
            expect(res).toEqual(mockFolder);

        })
        
    })

    describe('update', () => {

        it('successfully update a folder', async () => {

            const mockFolder = createMockFolder({ id: 8, name: 'old' });
            const newMockFolder = createMockFolder({ id: 8, name: 'new' });
            const dto: CreateFolderDto = {
                name: 'new'
            }

            folderRepository.findOneBy.mockResolvedValue(mockFolder);
            folderRepository.save.mockResolvedValue(newMockFolder);
            const res = await service.update(8, dto);

            expect(folderRepository.findOneBy).toHaveBeenCalledWith({ id: 8 });
            expect(res).toEqual(newMockFolder);

        })

        it('failed to update a folder', async () => {

            folderRepository.findOneBy.mockResolvedValue(null);

            await expect(service.findOne(8)).rejects.toBeInstanceOf(NotFoundException);
            await expect(service.findOne(8)).rejects.toThrow('Folder not Found');
            expect(folderRepository.findOneBy).toHaveBeenCalled();

        })

    })

    describe('remove', () => {

        it('successful delete', async () => {

            const deleteRes: DeleteResult =  {
                affected: 1,
                raw: undefined as any,
            };
            folderRepository.delete.mockResolvedValue(deleteRes);

            await expect(service.remove(1)).resolves.toBeUndefined();
            expect(folderRepository.delete).toHaveBeenCalled();

        })

        it('unsucessful delete', async () => {

            const deleteRes: DeleteResult = {
                affected: 0,
                raw: undefined as any,
            };

            folderRepository.delete.mockResolvedValue(deleteRes);

            await expect(service.remove(1)).rejects.toBeInstanceOf(NotFoundException);
            await expect(service.remove(1)).rejects.toThrow('Folder not Found');

        })

    })

})