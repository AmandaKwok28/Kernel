export const createMockRepository = () => ({
    find: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),    // will be overriden in service tests depending on which calls are made
})