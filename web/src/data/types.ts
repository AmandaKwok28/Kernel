export type FileType = {
    id: number;
    name: string;
    blocks: BlockType[];
    folderId: number | null;
}

export type DirtyType = {
    fileId: number;
    isDirty: boolean;
}

export type BlockType = {
    id: string;
    type: "text";
    content: string;
} | {
    id: string;
    type: "code";
    language: "python";
    code: string;
    output?: string;
}

export type FolderType = {
    id: number;
    name: string;
}


export type PaginationResult = {
    data: PaginatedFiles[],
    total: number;
    page: number;
    lastPage: number;
}

export type PaginatedFiles = {
    id: number;
    name: string;
    content: string;
    folder: FolderType | null;
    folderId: number | null;  
}

export type PaginationData = {
    id: number;
    name: string;
    blocks: BlockType[];
    folder: FolderType | null;
    folderId: number | null;
}