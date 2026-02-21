import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { File } from 'src/file/entity/file.entity';
import { Folder } from 'src/folder/entity/folder.entity'
import { FileModule } from './file/file.module';
import { FolderModule } from './folder/folder.module';
import path from 'path';

@Module({
  // forRoot exposes all config properties as env variables
  imports: [
    ConfigModule.forRoot(),                                       // allows us to use environment variables from a .env file
    TypeOrmModule.forRoot({
      type: 'sqlite',                                             // installed the sqlite3 driver for our datasource
      database: path.join(__dirname, '..', 'db', 'app.db'),       // will be created automatically on start
      entities: [File, Folder],
      synchronize: false,                                         // shouldn't be used for prod: it auto updates db schema to match entities
    }),
    FileModule,                                                   // register our custom File Module
    FolderModule,                                                 // register our custom Folder Module
  ],       
  controllers: [AppController],
  providers: [AppService],
})

// now the TypeORM Datasource and EntityManager objects will be available to inject across the entire project
// Datasource: holds db connection settings and establishes the connection
// EntityManager: provides methods to perform db operations (CRUD) on entities
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
