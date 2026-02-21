import { createFile, deleteFile, fetchFiles, updateFile } from "@/data/files"
import type { BlockType } from "@/data/types";
import { $files, addFile, addUpdatedFile, removeStoreFile, setFiles } from "@/lib/store";
import { useStore } from "@nanostores/react";
import { useEffect } from "react";

export const useFiles = () => {
    // pattern:
    // fetch data
    // update local state
    const files = useStore($files);

    const getFiles = async () => {
        try {
            const data = await fetchFiles();
            setFiles(data);
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