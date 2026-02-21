import { Test } from '@nestjs/testing';                         // Test class mocks the full Nest runtime and gives you hooks to manage class instance
import { NotFoundException } from '@nestjs/common';             // The only exception thrown so far
import { getRepositoryToken } from '@nestjs/typeorm';           // Nest.js uses tokens to identify your repo, so we generate the same one in order to feed Nest our mocked repo
import { DeleteResult } from 'typeorm';                         // types we'll use

import { FileService } from 'src/file/file.services';
import { File } from 'src/file/entity/file.entity';             // both File and Folder will be used to generate repository tokens for our DI (dependency injection) mock
import { Folder } from 'src/folder/entity/folder.entity';

import { createMockFile } from 'test/factories/files';
import { CreateFileDto } from 'src/file/dto/create-file.dto';
import { createMockFolder } from 'test/factories/folders';
import { createMockRepository } from 'test/utils/mock-repository';

// testing logic: this file tests the file service which depends on both the file and folder repos which we will mock
// In Nest.js docs, they test controller routing logic which is why they mock the service but we're looking to test the service


/* testing pattern:

    - identify a situation, ex: updating a file with invalid folder
    - use the following testing pattern

        1. mock any data you'll be operating on or using as an expected return value
        2. mock the resolved value for any repository functions your service may call as a part of its business logic
        3. make the service call
        4. check the business logic using .toHaveBeenCalledWith 
        5. check the expected return value
            - this includes exceptions that were thrown 
            - exception messages they were thrown with

*/


describe('FileService (unit)', () => {

    let service: FileService;

    // mock the file repository s.t. each function is a mock from jest
    // we define the type for the mocked repo to be of interface jest.Mock which we'll define later
    let fileRepository: {
        findAndCount: jest.Mock;        
        findOne: jest.Mock;
        findOneBy: jest.Mock;
        create: jest.Mock;
        save: jest.Mock;
        delete: jest.Mock;
    };

    // similarly define the file repo (we only use findOne)
    let folderRepository: {
        findOne: jest.Mock;
    };

    // set up before each following test
    beforeEach(async () => {

        // we define the repos with jest.fn() which creates a mock function
        // these mocks track calls, arguments, and can return fake values and simulate resolved promises
        fileRepository = createMockRepository();

        folderRepository = {
            findOne: jest.fn(),
        };

        // create a test module by creating a fake Nest DI container and registering our file service
        // we override the repo dependencies with our mocks from earlier
        const moduleRef = await Test.createTestingModule({
            providers: [
                FileService,
                { provide: getRepositoryToken(File), useValue: fileRepository},
                { provide: getRepositoryToken(Folder), useValue: folderRepository},
            ],
        }).compile();

        // fully constructed file service with mocked dependencies
        service = moduleRef.get(FileService);
    })

    // after each test, resets call counts 
    afterEach(() => {
        jest.clearAllMocks();
    });

    // testing the actual services
    describe('findAll', () => {

        // testing pagination
        it('returns paginated result', async () => {

            // mock two files
            const mockFiles = Array.from({ length: 2 }, () => createMockFile());
            const total = 42;

            // here, we indicate that findAndCount call should return the following mocked values when we eventually call it
            fileRepository.findAndCount.mockResolvedValue([mockFiles, total]);

            const page = 2;
            const limit = 20;

            // we query our service which will run through its defined business logic using our mocked repository functions
            // and our mocked return value above in line 83
            const res = await service.findAll(page, limit);

            // since our jest.fn() tracks calls, we can check what logic it used
            expect(fileRepository.findAndCount).toHaveBeenCalledWith({
                relations: ['folder'],
                skip: (page - 1) * limit,
                take: limit,
                order: { created_at: 'DESC' }
            });

            // we can also check the return value after it has run through that logic
            expect(res).toEqual({
                data: mockFiles,
                total,
                page,
                lastPage: Math.ceil(total / limit),
            });
        });


        it('uses default page/limit when not provided', async () => {

            fileRepository.findAndCount.mockResolvedValue([[], 0]);
            const res = await service.findAll();

            expect(fileRepository.findAndCount).toHaveBeenCalledWith({
                relations: ['folder'],
                skip: 0,
                take: 20,
                order: { created_at: 'DESC' },
            });

            expect(res).toEqual({
                data: [],
                total: 0,
                page: 1,
                lastPage: 0,
            });

        });
    });

    describe('findOne', () => {

        it('returns file when found', async () => {

            // mock the data
            const mockFile = createMockFile({ id: 7 });
            

            // mock repository dependency
            fileRepository.findOne.mockResolvedValue(mockFile);

            // make the service call to test business logic
            const res = await service.findOne(7);

            // check expected business logic branching
            expect(fileRepository.findOne).toHaveBeenCalledWith({
                where: { id: 7 },
            });

            // check expected result
            expect(res).toEqual(mockFile);
        });

        it('throws exception when file not found', async () => {
            
            // in this case we don't have data
            fileRepository.findOne.mockResolvedValue(null);

            // check the type of exception our service threw
            await expect(service.findOne(999)).rejects.toBeInstanceOf(NotFoundException);

            // check the error that was thrown with it
            await expect(service.findOne(999)).rejects.toThrow('File not found');
        });

    });

    describe('create', () => {

        it('create file without folder', async () => {

            // mock the data
            const createFileDto: CreateFileDto = {
                name: 'test file',
                content: '[]',
                folderId: undefined,
            }
            const mockFile = createMockFile(createFileDto);

            // mock the corresponding repo values
            fileRepository.create.mockReturnValue(mockFile);
            fileRepository.save.mockResolvedValue(mockFile);

            // make the call
            const res = await service.create(createFileDto);

            // check the logic
            expect(folderRepository.findOne).not.toHaveBeenCalled();
            expect(fileRepository.create).toHaveBeenCalledWith({
                ...createFileDto
            });
            expect(fileRepository.save).toHaveBeenCalledWith(mockFile);

            // check expected value
            expect(res).toEqual(mockFile);

        })

        it('create file with a folder', async () => {

            // can put this in the factory later
            const dto: CreateFileDto = {
                name: 'test file',
                content: '[]',
                folderId: 3
            };
            const mockFile = createMockFile(dto);
            const mockFolder = createMockFolder({ id: 3 });

            // mock the resolved values
            fileRepository.create.mockReturnValue(mockFile);
            fileRepository.save.mockResolvedValue(mockFile);
            folderRepository.findOne.mockResolvedValue(mockFolder);

            const res = await service.create(dto);

            expect(folderRepository.findOne).toHaveBeenCalledWith({
                where: { id: dto.folderId }
            });

            expect(fileRepository.create).toHaveBeenCalledWith({
                name: dto.name,
                content: dto.content,
                folder: mockFolder,
            });

            expect(fileRepository.save).toHaveBeenCalledWith(mockFile);
            expect(res).toEqual(mockFile);

        })

        it('create file with invalid folderId', async () => {

            const dto: CreateFileDto = {
                name: 'test file',
                content: '[]',
                folderId: 3
            };
            folderRepository.findOne.mockResolvedValue(null);

            await expect(service.create(dto)).rejects.toBeInstanceOf(NotFoundException);
            await expect(service.create(dto)).rejects.toThrow('Folder not found');

        })

    });

    describe('update', () => {

        it('throws exception if file dne', async () => {

            fileRepository.findOneBy.mockResolvedValue(null);

            await expect(service.update(1, { name: 'x' })).rejects.toBeInstanceOf(NotFoundException);
            await expect(service.update(1, { name: 'x' })).rejects.toThrow('File not found');

        })

        it('throws error if dto has no fields', async () => {

            const existing = createMockFile();
            fileRepository.findOneBy.mockResolvedValue(existing);

            await expect(service.update(1, {} as any)).rejects.toThrow('At least one filed must be provided');

        })

        it('updates name / content and saves', async () => {

            const mockFile = createMockFile();
            fileRepository.findOneBy.mockResolvedValue(mockFile);

            const savedFile = createMockFile({ name: 'new', content: 'new' });
            fileRepository.save.mockResolvedValue(savedFile);

            // update the new file with new fields name and content
            const res = await service.update(1, { name: 'new', content: 'new' });

            expect(fileRepository.save).toHaveBeenCalledWith(mockFile);
            expect(res).toEqual(savedFile);

            // check that the mockFile has been assigned the new fields
            expect(mockFile).toMatchObject({ name: 'new', content: 'new' });

        })

        it('update by placing file in a new folder (update folderId)', async () => {

            const mockFile = createMockFile();
            const mockFolder = createMockFolder({ id: 55 });
            fileRepository.findOneBy.mockResolvedValue(mockFile);
            fileRepository.save.mockResolvedValue(mockFile);
            folderRepository.findOne.mockResolvedValue(mockFolder);

            await service.update(mockFile.id, { folderId: 55 });

            expect(mockFile.folderId).toBe(55);
            expect(folderRepository.findOne).toHaveBeenCalled();
        })

    });

    describe('remove', () => {

        it('succesful delete', async () => {

            const deleteRes: DeleteResult = {
                affected: 1,
                raw: undefined as any
            };
            fileRepository.delete.mockResolvedValue(deleteRes);

            await expect(service.remove(1)).resolves.toBeUndefined();
            expect(fileRepository.delete).toHaveBeenCalledWith(1);

        })

        it('unsucessful delete exception handling', async () => {

            const deleteRes: DeleteResult = {
                affected: 0, 
                raw: undefined as any
            };
            fileRepository.delete.mockResolvedValue(deleteRes);

            await expect(service.remove(1)).rejects.toBeInstanceOf(NotFoundException);
            await expect(service.remove(1)).rejects.toThrow('File not found');

        })
        
    });

})