export type FileType = {
    id: number;
    name: string;
    blocks: BlockType[];
}

export type FolderType = {
    id: number;
    name: string;
    files: FileType[];
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

export type ApiResponse<T> = {
    data: T;
    message: any;
}