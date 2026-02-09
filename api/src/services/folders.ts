import { db } from "../db/db.js";
import type { FolderType } from "../types/file.js";

export const Folders = {

    get(): FolderType[] {
        return db
            .prepare<[], FolderType>(`
                SELECT *
                FROM folders
            `)
            .all()
    },

    getById(id: number): FolderType | undefined {
        return db
            .prepare<[number], FolderType>(`
                SELECT * 
                FROM folders
                WHERE id = ?
            `)
            .get(id)
    },

    create(
        name: string,
    ): FolderType {
        const result = db
            .prepare<string, never>(`
                INSERT INTO folders (name)
                VALUES (?)
            `)
            .run(name)

        const folder = this.getById(result.lastInsertRowid as number);

        if (!folder) {
            throw new Error("Failed to fetch this folder after insert");
        }

        return folder;
    },


    update(id: number, name: string): FolderType | null {
        const result = db
            .prepare<[string, number], never>(`
                UPDATE folders
                SET name = ?
                WHERE id = ?
            `)
            .run(name, id);

        if (result.changes === 0) {
            return null;
        }

        const folder = this.getById(id);
        if (!folder) {
            throw new Error("Failed to fetch folder after update");
        }

        return folder;
    },



    delete(id: number): boolean {
        const result = db.prepare<number, never>(`
            DELETE
            FROM folders
            WHERE id = ?
        `)
        .run(id);

        return result.changes > 0;
    }

}