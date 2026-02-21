import { createFile, deleteFile, fetchFiles, updateFile } from "@/data/files"
import type { BlockType, FolderType, PaginationData } from "@/data/types";
import { $files, addFile, addUpdatedFile, removeStoreFile, setFiles, setFolders } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

export const useFiles = () => {
    // pattern:
    // fetch data
    // update local state
    const files = useStore($files);

    const getFiles = async () => {
        try {
            const res = await fetchFiles();
            setFiles(res.map((data: PaginationData) => ({
                id: data.id,
                name: data.name,
                blocks: data.blocks,
                folderId: data.folderId
            })));

            // set the folders as well
            const folders = Array.from(
                new Map(
                    res
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

    useEffect(() => {
        getFiles();
    }, [])

    return {
        files,
        makeFile,
        editFile,
        removeFile
    }
}