import type { MenuTarget, MenuType } from "@/components/sidebar/menu";
import type { SidebarMode } from "@/components/sidebar/thin-sidebar";
import type { FileType, FolderType } from "@/data/types";
import { useFiles } from "@/mutations/files";
import { useFolders } from "@/mutations/folders";
import { useEffect, useState, useMemo } from "react";

type Args = {
    files: FileType[];
    folders: FolderType[];
    setSelectedFileId: (id: number | null) => void;
}

export function useSidebarController({
    files,
    folders, 
    setSelectedFileId
}: Args) {
    
    // manage the state / lifecycle of objects in sidebar
    const [open, setOpen] = useState<boolean>(false);
    const [mode, setMode] = useState<SidebarMode>("files");

    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

    const [menu, setMenu] = useState<MenuType | null>(null);
    const [renameTarget, setRenameTarget] = useState<MenuTarget | null>(null);
    const [newName, setNewName] = useState("");

    const [createNewFile, setCreateNewFile] = useState(false);
    const [createNewFolder, setCreateNewFolder] = useState(false);
    const [filename, setFilename] = useState("");
    const [foldername, setFoldername] = useState("");

    const { editFile, removeFile, makeFile } = useFiles();
    const { editFolder, removeFolder, makeFolder } = useFolders();

    // handles the right click menu for rename / deletion of files/folders on sidebar
    useEffect(() => {
        const close = () => setMenu(null);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);

    const toggleFolder = (id: number) => {
        setExpandedFolders((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
        });
    };

    const onRightClick = (e: React.MouseEvent, target: MenuTarget) => {
        e.preventDefault();
        e.stopPropagation();
        setMenu({ x: e.clientX, y: e.clientY, target });
    };

    const handleRename = (target: MenuTarget) => {
        setRenameTarget(target);

        if (target.type === "file") {
        const file = files.find((f) => f.id === target.id);
        if (file) setNewName(file.name);
        } else {
        const folder = folders.find((f) => f.id === target.id);
        if (folder) setNewName(folder.name);
        }
    };

    const commitRename = async () => {
        if (!renameTarget) return;

        const name = newName.trim();
        if (!name) {
        setRenameTarget(null);
        return;
        }

        if (renameTarget.type === "file") await editFile(renameTarget.id, name);
        else await editFolder(renameTarget.id, name);

        setRenameTarget(null);
        setNewName("");
    };

    const cancelRename = () => {
        setRenameTarget(null);
        setNewName("");
    };

    const handleDelete = async (target: MenuTarget) => {
        if (target.type === "file") await removeFile(target.id);
        else await removeFolder(target.id);
    };

    const handleNewFile = () => {
        setCreateNewFile(true);

        if (selectedFolderId != null) {
        setExpandedFolders((prev) => {
            const next = new Set(prev);
            next.add(selectedFolderId);
            return next;
        });
        }
    };

    const handleNewFolder = () => setCreateNewFolder(true);

    const handleSubmitFile = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        const name = filename.trim();
        if (!name) return;

        setCreateNewFile(false);

        const newFile = await makeFile(name, selectedFolderId ?? undefined);
        if (newFile) setSelectedFileId(newFile.id);

        setFilename("");
    };

    const handleSubmitFolder = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        const name = foldername.trim();
        if (!name) return;

        setCreateNewFolder(false);

        await makeFolder(name);
        setFoldername("");
    };

    const rootFiles = useMemo(
        () => files.filter((f) => f.folderId == null),
        [files]
    );

    const folderFilesById = useMemo(() => {
        const map = new Map<number, FileType[]>();
        for (const f of files) {
        if (f.folderId == null) continue;
        const arr = map.get(f.folderId) ?? [];
        arr.push(f);
        map.set(f.folderId, arr);
        }
        return map;
    }, [files]);

    const clearSelection = () => {
        setMenu(null);
        setSelectedFileId(null);
        setSelectedFolderId(null);
    };

    return {
        // layout
        open,
        setOpen,
        mode,
        setMode,

        // derived
        rootFiles,
        folderFilesById,

        // folder ui
        expandedFolders,
        toggleFolder,
        selectedFolderId,
        setSelectedFolderId,

        // menu / rename
        menu,
        setMenu,
        onRightClick,
        renameTarget,
        newName,
        setNewName,
        handleRename,
        commitRename,
        cancelRename,
        handleDelete,

        // create
        createNewFile,
        setCreateNewFile,
        createNewFolder,
        setCreateNewFolder,
        filename,
        setFilename,
        foldername,
        setFoldername,
        handleNewFile,
        handleNewFolder,
        handleSubmitFile,
        handleSubmitFolder,

        // misc
        clearSelection,
    }
}