import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from 'src/file/file.services';
import { FileController } from 'src/file/file.controller';
import { File } from 'src/file/entity/file.entity';
import { Folder } from 'src/folder/entity/folder.entity';

@Module({
    imports: [TypeOrmModule.forFeature([File, Folder])],    // forFeature method defines which repositories are registered in the current scope
    providers: [FileService],
    controllers: [FileController],
})

export class FileModule {};


/* Notes about Repositories

- it's something that comes from the database data source object provided by typeORM
- taking one step back, typeORM provides you with an entityManager object
    - allows you to manage (insert, delete, load, update, etc.) any entity

- a repo is like an entity manager but it's limited to a single entity. So like for example the file repo only modifies files
- you can get access to the repository via the EntityManager which you can access via the datasource

    ex: 

    const myDataSource = new DataSource(...);
    const user = await myDataSource.manager.findOneBy(...)     // this is how you access the manager

    const userRepo = dataSource.getRepository(User)             // this is how you access the repository for that specific entity

*/