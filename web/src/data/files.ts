import type { BlockType, FileType, ApiResponse } from "./types";
import { API_URL } from "@/env";

export async function fetchFiles(): Promise<FileType[]> {
    const res = await fetch(`${API_URL}/files`);

    if (!res.ok) {
        throw new Error(`Failed to fetch files (${res.status})`);
    }

    const json: ApiResponse<any[]> = await res.json();
    return json.data.map((file) => ({
        id: file.id,
        name: file.name,
        blocks: JSON.parse(file.content ?? "[]"),
        folder_id: file.folder_id,
    }));
}

export async function createFile(
    name: string,
    folder_id?: number
): Promise<FileType> {
    const res = await fetch(`${API_URL}/files`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            folder_id,
            content: JSON.stringify([]),
        })
    })

    if (!res.ok) {
        console.error("Error creating a new file status", res.status);
    }

    const json: ApiResponse<any> = await res.json();
    return {
        id: json.data.id,
        name: json.data.name,
        blocks: JSON.parse(json.data.content ?? "[]"),
        folder_id: json.data.folder_id
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

    const json: ApiResponse<any> = await res.json();
    return {
        id: json.data.id,
        name: json.data.name,
        blocks: JSON.parse(json.data.content ?? "[]"),
        folder_id: json.data.folder_id
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

