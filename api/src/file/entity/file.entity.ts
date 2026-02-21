import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, RelationId } from "typeorm";
import { Folder } from "../../folder/entity/folder.entity";

@Entity({ name: 'Files' })
export class File {
    @PrimaryGeneratedColumn()
    id: number;                                                 // file id

    @Column("varchar", { length: 200 })                         // specify max length of name
    name: string;

    @Column()
    content: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;

    // a file belongs to one folder
    @ManyToOne(() => Folder, (folder) => folder.files, {
        onDelete: 'CASCADE',                                    // if the folder is deleted, delete all its files
    })

    // typeORM creates this foreign key column by default but we want to specify its name which is why we write it ourselves
    @JoinColumn({ name: "folder_id" })
    folder: Folder                                              // property on the File that represents the related Folder object

    @RelationId((file: File) => file.folder) 
    folderId: number;
}