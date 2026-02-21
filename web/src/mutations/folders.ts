import { createFolder, deleteFolder, updateFolder } from "@/data/folders";
import { $folders, addFolder, addUpdatedFolder, removeStoreFolder } from "@/lib/store"
import { useStore } from "@nanostores/react"

export const useFolders = () => {

    const folders = useStore($folders);

    // const getFolders = async () => {
    //     try {
    //         const data = await fetchFolders();
    //         setFolders(data);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    const makeFolder = async (name: string) => {
        try {
            const folder = await createFolder(name);
            addFolder(folder);
            return folder;
        } catch (err) {
            console.error(err);
        }
    }

    const editFolder = async (id: number, name: string) => {
        try {
            const folder = await updateFolder(id, name);
            addUpdatedFolder(folder);
            return folder;
        } catch (err) {
            console.error(err);
        }
    }

    const removeFolder = async (id: number) => {
        try {
            await deleteFolder(id);
            removeStoreFolder(id);
        } catch (err) {
            console.error(err);
        }
    }

    // useEffect(() => {
    //     getFolders();
    // }, [])

    return {
        folders,
        makeFolder,
        editFolder,
        removeFolder
    }
}