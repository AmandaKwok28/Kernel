import type { BlockType, FileType } from "./types";
import { API_URL } from "@/env";

export async function fetchFiles(): Promise<FileType[]> {
    const res = await fetch(`${API_URL}/files`);

    if (!res.ok) {
        throw new Error(`Failed to fetch files (${res.status})`);
    }

    const json = await res.json();
    return json.map((file: any) => ({
        id: file.id,
        name: file.name,
        blocks: JSON.parse(file.content ?? "[]"),
        folderId: file.folderId,
    }));
}

export async function createFile(
    name: string,
    folderId?: number
): Promise<FileType> {
    const res = await fetch(`${API_URL}/files`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            folderId,
            content: JSON.stringify([]),
        })
    })

    if (!res.ok) {
        console.error("Error creating a new file status", res.status);
    }

    const json = await res.json();
    return {
        id: json.id,
        name: json.name,
        blocks: JSON.parse(json.content ?? "[]"),
        folderId: json.folderId
    };
}

export async function updateFile(
    id: number, 
    name?: string, 
    content?: BlockType[]
): Promise<FileType> {

    const body: Record<string, any> = {};
    if (name !== undefined) {
        body.name = name;
    }

    if (content !== undefined) {
        body.content = JSON.stringify(content);
    }

    const res = await fetch(`${API_URL}/files/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })

    if (!res.ok) {
        console.error("Error updating file with status", res.status);
    }

    const json = await res.json();
    return {
        id: json.id,
        name: json.name,
        blocks: JSON.parse(json.content ?? "[]"),
        folderId: json.folderId
    };
}


export async function deleteFile(
    id: number
): Promise<boolean> {

    const res = await fetch(`${API_URL}/files/${id}`, {
        method: "DELETE"
    })

    if (!res.ok) {
        console.error("Error deleting file with status", res.status);
    }
    
    return true
}

