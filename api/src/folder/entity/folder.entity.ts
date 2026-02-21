import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { File } from '../../file/entity/file.entity';

@Entity({ name: 'Folders' })
export class Folder {
    @PrimaryGeneratedColumn()
    id: number; 

    @Column()
    name: string;

    // a folder can have many files
    @OneToMany(() => File, (file) => file.folder)
    files: File[];
}

// note that the folder doesn't need to know it's files in my frontend architecture so the @OneToMany is not necessary here, just verbose for clarity