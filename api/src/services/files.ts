
import { db } from "../db/db.js";
import type { FileType } from "../types/file.js";

export const Files = {
    
    // a function to get all file records
    get(): FileType[] {
        return db
            .prepare<[], FileType>(`
                SELECT * 
                FROM files 
                ORDER BY updated_at DESC
            `)
            .all();
    },

    // get file by id
    getById(id: number): FileType | undefined {
        return db
            .prepare<[number], FileType>(`
                SELECT * 
                FROM files
                WHERE id = ?
            `)
            .get(id)
    },

    // create a new file
    create(
        name: string, 
        content: string = "",
        folder_id: number | null = null
    ): FileType {
        const result = db
            .prepare<[string, string, number | null], never>(`
                INSERT INTO files (name, content, folder_id)
                VALUES (?, ?, ?)
            `)
            .run(name, content, folder_id);

        const file = this.getById(result.lastInsertRowid as number);

        if (!file) {
            throw new Error("Failed to fetch file after insert");
        }

        return file;
    },

    // update content
    update(
        id: number, 
        name?: string, 
        content?: string,
        folder_id?: number | null
    ): FileType | null{
        const fields: string[] = [];
        const values: any[] = [];

        if (name !== undefined) {
            fields.push("name = ?");
            values.push(name);
        }

        if (content !== undefined) {
            fields.push("content = ?");
            values.push(content);
        }

        if (folder_id !== undefined) {
            fields.push("folder_id = ?");
            values.push(folder_id);
        }

        if (fields.length === 0) {
            return null;
        }

        const stmt = `
            UPDATE files
            SET ${fields.join(", ")}
            WHERE id = ?
        `
        const result = db.prepare(stmt).run(...values, id);

        if (result.changes === 0) {
            return null;
        }

        const file = this.getById(id);
        if (!file) {
            throw new Error("Failed to fetch file after update");
        }

        return file;
    },

    delete(id: number): boolean {
        const result = db.prepare<[number], never>(`
            DELETE 
            FROM files
            WHERE id = ?
        `)
        .run(id)

        return result.changes > 0;
    },

}