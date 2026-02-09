export type FileType = {
    id: number;
    name: string;
    content: string | null;
    folder_id: number | null,
    created_at: string;
    updated_at: string;
}

export type FolderType = {
    id: number;
    name: string;
}