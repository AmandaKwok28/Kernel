import { Search, File, Folder } from "lucide-react";
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
    theme: string;
    textStyle: React.CSSProperties;
    setSelectedFileId: (id: number | null) => void;

};


const Sidebar = ({
    files,
    folders,
    selectedFileId,
    selectFile,
    dirty,
    theme,
    textStyle,
    setSelectedFileId
}: Props) => {

    // state
    const [open, setOpen] = useState(false);                                            // open or closed sidebar
    const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set());     // folder expansion state
    const [menu, setMenu] = useState<MenuType | null>(null);
    const [renameTarget, setRenameTarget] = useState<MenuTarget | null>(null);
    const [newName, setNewName] = useState("");
    const [createNewFile, setCreateNewFile] = useState(false);                              // indicates user hit create file
    const [createNewFolder, setCreateNewFolder] = useState(false);
    const [filename, setFilename] = useState("");      
    const [foldername, setFoldername] = useState("");
    const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);


    // mutations
    const { editFile, removeFile, makeFile } = useFiles();
    const { editFolder, removeFolder, makeFolder } = useFolders();

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
            await removeFolder(target.id);
        }
    };


    // file and folder creation handlers
    const handleNewFile = () => {
        setCreateNewFile(true);
        if (selectedFolderId != null) {
            setExpandedFolders(prev => {
                const next = new Set(prev);
                next.add(selectedFolderId);
                return next;
            })
        }
    }

    const handleNewFolder = () => {
        setCreateNewFolder(true);
    }

    const handleSubmitFile = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        if (!filename.trim()) return;

        setCreateNewFile(false);

        const newFile = await makeFile(filename, selectedFolderId ?? undefined);
        if (!newFile) {
            return;         // add an error later
        }
        setSelectedFileId(newFile.id);

        setFilename("");
    }

    const handleSubmitFolder = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        if (!foldername.trim()) return;

        setCreateNewFolder(false);

        const newFolder = await makeFolder(foldername);
        if (!newFolder) {
            return;         
        }
        setFoldername("");   
    };

    const rootFiles = files.filter(f => f.folderId == null);

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
            <div className="flex flex-col h-full w-[300px] bg-[var(--bg-open-sidebar)] gap-1"
                onClick={(e) => {
                    if (e.target !== e.currentTarget) return;   // only trigger when clicking on empty space in sidebar, not on file/folder rows
                    setMenu(null);                  // close menu on click anywhere in sidebar
                    setSelectedFileId(null);        // also deselect any selected files / folders
                    setSelectedFolderId(null);
                }}   
            >

                <SidebarHeader 
                    handleNewFile={handleNewFile}
                    hanldeNewFolder={handleNewFolder}
                />

                {/* Create File Input */}
                {selectedFolderId === null && createNewFile && (
                    <div className="flex items-center gap-2 mx-2 px-2 py-1 rounded-[4px] bg-[var(--bg-select-note)]">
                    <File size="13px" className="shrink-0 text-[var(--new-file-icon)]" />

                    <input
                        type="text"
                        autoFocus
                        placeholder="New file name"
                        className="bg-transparent outline-none border-b w-full text-[var(--create-text-color)]"
                        value={filename}
                        onChange={(e) => setFilename(e.target.value)}
                        onKeyDown={handleSubmitFile}
                        style={textStyle}
                    />
                    </div>
                )}

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
                        onClick={() => {
                            selectFile(file)
                            setSelectedFolderId(null);
                        }}
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
                        (f: FileType) => f.folderId === folder.id
                    );

                    const folderIsDirty = folderFiles.some(
                        (f: FileType) => dirty.fileId === f.id && dirty.isDirty
                    );

                    const isFolderRenaming =
                        renameTarget?.type === "folder" &&
                        renameTarget.id === folder.id;

                    const isSelected = selectedFolderId === folder.id;

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
                            renameTarget={renameTarget}
                            isFolderRenaming={isFolderRenaming}
                            onSelectFolder={() => {
                                setSelectedFolderId(folder.id)
                                setSelectedFileId(null);
                            }}
                            selectedFolderId={selectedFolderId}
                            isSelected={isSelected}
                            setSelectedFolderId={setSelectedFolderId}
                            createNewFile={createNewFile}
                            filename={filename}
                            setFilename={setFilename}
                            handleSubmitFile={handleSubmitFile}
                        />
                    );
                })}

                {/* Create Folder Input */}
                {createNewFolder && (
                    <div className="flex items-center gap-2 mx-2 py-1 px-2 rounded-[4px] bg-[var(--bg-select-note)]">
                        <Folder size="13px" className="shrink-0 text-[var(--new-folder-icon)]" />
                        <input
                            type="text"
                            autoFocus
                            placeholder="New folder name"
                            className="bg-transparent outline-none border-b w-full text-[var(--create-text-color)]"
                            value={foldername}
                            onChange={(e) => setFoldername(e.target.value)}   // change to folder name
                            onKeyDown={handleSubmitFolder}  // change to folder stuff
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
