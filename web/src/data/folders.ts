import type { FolderType, ApiResponse } from "./types";
import { API_URL } from "@/env";

export async function fetchFolders(): Promise<FolderType[]> {
    const res = await fetch(`${API_URL}/folders`);

    if (!res.ok) {
        throw new Error(`Failed to fetch folders (${res.status})`);
    }

    const json: ApiResponse<any[]> = await res.json();
    return json.data.map((folder) => ({
        id: folder.id,
        name: folder.name
    }));
}

export async function createFolder(name: string): Promise<FolderType> {
    const res = await fetch(`${API_URL}/folders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
        })
    })

    if (!res.ok) {
        throw new Error(`Error creating a new folder status ${res.status}`);
    }

    const json: ApiResponse<any> = await res.json();
    return {
        id: json.data.id,
        name: json.data.name,
    };
}

export async function updateFolder(
    id: number, 
    name: string, 
): Promise<FolderType> {

    const res = await fetch(`${API_URL}/folders/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name })
    })

    if (!res.ok) {
        throw new Error(`Error updating file with status: ${res.status}`);
    }

    const json: ApiResponse<any> = await res.json();
    return {
        id: json.data.id,
        name: json.data.name,
    };
}

export async function deleteFolder(
    id: number
): Promise<boolean> {

    const res = await fetch(`${API_URL}/folders/${id}`, {
        method: "DELETE"
    })

    if (!res.ok) {
        throw new Error(`Error deleting folder with status: ${res.status}`);
    }
    
    return true
}

