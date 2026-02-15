import { Search, TextAlignStart, File } from "lucide-react";
import FolderSection from "./folderSection";
import type { FileType, FolderType } from "@/data/types";
import FileRow from "./fileRow";
import SidebarHeader from "./header";
import { useEffect, useState } from "react";
import SidebarMenu, { type MenuTarget, type MenuType } from "./menu";
import { useFiles } from "@/mutations/files";
import { useFolders } from "@/mutations/folders";


type Props = {
    files: FileType[];
    folders: FolderType[];

    selectedFileId: number | null;
    selectFile: (file: FileType) => void;

    dirty: { fileId: number | null; isDirty: boolean };

    createNewFile: boolean;
    handleNewFile: () => void;
    filename: string;
    setFilename: (v: string) => void;
    handleSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;

    theme: string;
    textStyle: React.CSSProperties;

};


const Sidebar = ({
    files,
    folders,
    selectedFileId,
    selectFile,
    dirty,
    createNewFile,
    handleNewFile,
    filename,
    setFilename,
    handleSubmit,
    theme,
    textStyle,
}: Props) => {

    // state
    const [open, setOpen] = useState(false);                                            // open or closed sidebar
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());     // folder expansion state
    const [menu, setMenu] = useState<MenuType | null>(null);
    const [renameTarget, setRenameTarget] = useState<MenuTarget | null>(null);
    const [newName, setNewName] = useState("");

    // mutations
    const { editFile, removeFile } = useFiles();
    const { editFolder } = useFolders();

    // use effect
    useEffect(() => {
        const close = () => setMenu(null);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);

        
    // handlers
    const toggleFolder = (id: number) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const onRightClickLocal = (e: React.MouseEvent, target: MenuTarget) => {
        e.preventDefault();
        e.stopPropagation();
        setMenu({ x: e.clientX, y: e.clientY, target });
    };

    const handleRename = (target: MenuTarget) => {
        setRenameTarget(target);

        if (target.type === "file") {
            const file = files.find(f => f.id === target.id);
            if (file) setNewName(file.name);
        } else {
            const folder = folders.find(f => f.id === target.id);
            if (folder) setNewName(folder.name);
        }
    };

    const commitRename = async () => {
        if (!renameTarget) return;

        const name = newName.trim();
        if (!name) return setRenameTarget(null);

        if (renameTarget.type === "file") {
            await editFile(renameTarget.id, name);
        } else {
            await editFolder(renameTarget.id, name);
        }

        setRenameTarget(null);
    };

    const cancelRename = () => {
        setRenameTarget(null);
        setNewName("");
    };

    const handleDelete = async (target: MenuTarget) => {
        if (target.type === "file") {
            await removeFile(target.id);
        } else {
            // later: removeFolder
            console.log("TODO: delete folder", target.id);
        }
    };




    // Implement later
    const handleNewFolder = () => {

    };

    const rootFiles = files.filter(f => f.folder_id == null);

    return (
        <>
        {/* Thin icon sidebar */}
        <div
            className="flex flex-col items-center w-[35px] bg-[var(--bg-sidebar)] h-full p-4 gap-4"
            style={{
                borderLeft: theme === "dark" ? "none" : "1px solid var(--border)",
                borderRight: theme === "dark" ? "none" : "1px solid var(--border)",
                borderBottom: theme === "dark" ? "none" : "1px solid var(--border)",
            }}
        >
            <div
            className="text-[var(--icon-color)] hover:text-[var(--hover-note-icon)] cursor-pointer"
            onClick={() => setOpen(!open)}
            >
            <File strokeWidth="1.5px" size="20px" />
            </div>

            <div className="text-[var(--icon-color)] hover:text-[var(--hover-note-icon)] cursor-pointer">
            <Search strokeWidth="1.5px" size="20px" />
            </div>
        </div>

        {/* Expanded Sidebar */}
        {open && (
            <div className="flex flex-col h-full w-[300px] bg-[var(--bg-open-sidebar)] gap-1">

                <SidebarHeader 
                    handleNewFile={handleNewFile}
                    hanldeNewFolder={handleNewFolder}
                />

                {/* Root Files */}
                {rootFiles.map((file: FileType) => {

                    const isRenaming =
                        renameTarget?.type === "file" &&
                        renameTarget.id === file.id;

                    return (
                    <FileRow
                        key={file.id}
                        file={file}
                        isSelected={selectedFileId === file.id}
                        isRenaming={isRenaming}
                        isDirty={dirty.fileId === file.id && dirty.isDirty}
                        newName={newName}
                        setNewName={setNewName}
                        onClick={() => selectFile(file)}
                        onContextMenu={(e) => onRightClickLocal(e, { type: "file", id: file.id })}
                        onCommitRename={commitRename}
                        onCancelRename={cancelRename}
                        textStyle={textStyle}
                    />
                    );
                })}

                {/* Folders */}
                {folders.map((folder: FolderType) => {
                    const folderFiles = files.filter(
                        (f: FileType) => f.folder_id === folder.id
                    );

                    const folderIsDirty = folderFiles.some(
                        (f: FileType) => dirty.fileId === f.id && dirty.isDirty
                    );

                    return (
                        <FolderSection
                            key={folder.id}
                            folder={folder}
                            files={folderFiles}
                            isOpen={expandedFolders.has(folder.id)}
                            toggle={() => toggleFolder(folder.id)}
                            selectedFileId={selectedFileId}
                            dirtyFileId={dirty.fileId}
                            folderIsDirty={folderIsDirty}
                            newName={newName}
                            setNewName={setNewName}
                            selectFile={selectFile}
                            onRightClick={onRightClickLocal}
                            commitRename={commitRename}
                            cancelRename={cancelRename}
                            textStyle={textStyle}
                        />
                    );
                })}

                {/* Create File Input */}
                {createNewFile && (
                    <div className="flex items-center gap-1 mx-2 p-1 rounded-md bg-[var(--bg-select-note)]">
                    <TextAlignStart className="w-4 h-4 shrink-0" />

                    <input
                        type="text"
                        autoFocus
                        placeholder="New file name"
                        className="bg-transparent outline-none border-b w-full"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        onKeyDown={handleSubmit}
                        style={textStyle}
                    />
                    </div>
                )}
                </div>
            )}

            <SidebarMenu
                menu={menu}
                onClose={() => setMenu(null)}
                onRename={handleRename}
                onDelete={handleDelete}
            />

        </>
    );
};

export default Sidebar;
