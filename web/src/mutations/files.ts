import { createFile, deleteFile, fetchFiles, updateFile } from "@/data/files"
import type { BlockType, FolderType, PaginatedFiles, PaginationResult } from "@/data/types";
import { $files, addFile, addUpdatedFile, removeStoreFile, setFiles, setFolders } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

export const useFiles = () => {
    // pattern:
    // fetch data
    // update local state
    const files = useStore($files);

    const getFiles = async (search?: string, page?: number, limit?: number) => {
        try {
            const res: PaginationResult = await fetchFiles(search, page, limit);

            // evenutally make use of the meta field
            // for now just set the files and folders
            setFiles(res.data.map((data: PaginatedFiles) => ({
                id: data.id,
                name: data.name,
                blocks: JSON.parse(data.content ?? "[]"),
                folderId: data.folderId
            })));

            // set the folders as well. We set folders here to handle pagination edge cases
            const folders = Array.from(
                new Map(
                    res
                        .data
                        .map(file => file.folder)
                        .filter((folder): folder is FolderType => folder !== null)
                        .map(folder => [folder.id, folder])
                ).values()
            );

            setFolders(folders);

        } catch (err) {
            console.log(err);
        } 
    }

    // create files
    const makeFile = async (name: string, folderId?: number) => {
        try {
            const file = await createFile(name, folderId);
            addFile(file);
            return file;
        } catch (err) {
            console.log(err);
        }
    }

    // update files
    const editFile = async (id: number, name?: string, content?: BlockType[]) => {
        try {
            const file = await updateFile(id, name, content);
            addUpdatedFile(file);
            return file;
        } catch (err) {
            console.log(err)
        }
    }

    // delete a file
    const removeFile = async (id: number) => {
        try {
            await deleteFile(id);
            removeStoreFile(id);
        } catch (err) {
            console.log(err);
        }
    }

    const searchFiles =  async (search: string, page?: number, limit?: number)  => {
        const res = await fetchFiles(search, page, limit);

        const files = res.data.map((data: PaginatedFiles) => ({
            id: data.id,
            name: data.name,
            blocks: JSON.parse(data.content ?? "[]"),
            folderId: data.folderId,
        }));

        const folders = res.data.map((data: PaginatedFiles) => (data.folder));

        return [files, folders];
    };

    useEffect(() => {
        getFiles();
    }, [])

    return {
        files,
        makeFile,
        editFile,
        removeFile,
        searchFiles
    }
}