import { File } from 'src/file/entity/file.entity';

let idCtr = 1;

// note: Partial<T> makes every field in T optional and also prevents you from providing arbitrary fields
export const createMockFile = ( overrides: Partial<File> = {} ): File => {

    return {
        id: idCtr++,
        name: 'test file',
        content: '[]',
        created_at: new Date(),
        updated_at: new Date(),
        folder: undefined,
        folderId: null,
        ...overrides
    } as File;

};