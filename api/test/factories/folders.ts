import { Folder } from 'src/folder/entity/folder.entity';

let idCtr = 1;

export const createMockFolder = ( override: Partial<Folder> = {} ): Folder => {

    return {
        id: idCtr++,
        name: 'test folder',
        files: []
    } as Folder;

};