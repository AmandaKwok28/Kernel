import { File, FilePlusCorner, FolderPlus, Info, Search, TextAlignStart } from "lucide-react";
import { useEffect, useState } from "react";
import { $dirty, $files } from "@/lib/store";
import { useStore } from "@nanostores/react";
import type { FileType } from "@/data/types";
import Editor from "@/components/note/editor";
import { useFiles } from "@/mutations/files";

// #434744
// #1e1e1d
// #058ff9

type MenuType = {
    x: number;
    y: number;
    fileId: number | null;
}

// add folder support later
const Home = () => {

    // stored data
    const files = useStore($files);
    const dirty = useStore($dirty);

    // mutations
    const { makeFile, editFile, removeFile } = useFiles();

    // states
    const [open, setOpen] = useState(false);
    const [createNewFile, setCreateNewFile] = useState(false);
    const [filename, setFilename] = useState("");
    const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
    const [menu, setMenu] = useState<MenuType | null>(null);
    const [editFileId, setEditFileId] = useState<number | null>(null);
    const [newName, setNewName] = useState<string>("");

    useEffect(() => {
        const close = () => setMenu(null);
        window.addEventListener("click", close);
        return () => window.removeEventListener("click", close);
    }, []);


    const selectedFile: FileType | null =
    files.find((f) => f.id === selectedFileId) ?? null;

    const handleNewFile = () => {
        setCreateNewFile(true);
    }

    const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        if (!filename.trim()) return;

        setCreateNewFile(false);

        const newFile = await makeFile(filename);
        if (!newFile) {
            return;         // add an error later
        }
        setSelectedFileId(newFile.id);

        setFilename("");
    }

    const selectFile = (file: FileType) => {
        if (file.id !== selectedFileId) {
            setSelectedFileId(file.id);
        } else {
            setSelectedFileId(null);
        }
    };


    const onRightClick = (e: React.MouseEvent, fileId: number) => {
        e.preventDefault();  // stop the browser menu

        // get the file id of the object it's clicking on
        setMenu({
            x: e.clientX,
            y: e.clientY,
            fileId
        })
    }

    const handleRename = () => {
        if (menu?.fileId == null) return;

        const file = files.find((f) => f.id === menu.fileId);
        if (!file) return;

        setEditFileId(file.id);
        setNewName(file.name);
        setMenu(null);
    }

    const handleDelete = async () => {
        if (menu?.fileId == null) return;
        removeFile(menu.fileId);
    }

    const commitRename = async (fileId: number) => {
        const name = newName.trim();
        if (!name) {
            setEditFileId(null);
            return;
        }

        try {
            await editFile(fileId, name);
        } catch (err) {
            console.log("Failed to rename file", err)
        } finally {
            setEditFileId(null);
        }
    }


    const blocks = selectedFile ? selectedFile.blocks : [];
    
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <div id='header' className="flex min-w-screen h-[30px] bg-[#494c4a] "> 
            </div>

            <div id="main-body" className="flex flex-row flex-1 w-full overflow-hidden">
                <div 
                    id='sidebar' 
                    className="flex flex-col items-center w-[50px] bg-[#434744] h-full p-4 gap-4"
                >
                    <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => setOpen(!open)}> 
                        <File /> 
                    </div>
                    <div className="text-gray-400 hover:text-white cursor-pointer"> <Search /> </div>
                </div>
                {open && (
                    <div className="flex flex-col h-full w-[300px] bg-[#2c2f2d] gap-1">
                        <div className="flex flex-row w-full text-gray-300 justify-end gap-2 p-4">
                            <div className="text-gray-300 hover:text-white cursor-pointer">
                                <FilePlusCorner size="18px" onClick={handleNewFile}/>
                            </div>
                            <div className="text-gray-300 hover:text-white cursor-pointer">
                                <FolderPlus size="18px"/>
                            </div>
                        </div>

                        {/* store the files and eventually folders */}
                        {files.map((file) => {
                            return (
                                <div 
                                    key={file.id} 
                                    className={`
                                        flex items-center gap-2 text-gray-300 text-[12px]
                                        cursor-pointer px-2 py-[3px] mx-2 rounded-md
                                        ${selectedFileId === file.id
                                        ? "bg-[#3b3e3c]"
                                        : "hover:bg-[#3b3e3c]"}
                                    `}
                                    onClick={() => selectFile(file)}
                                    onContextMenu={(e) => {
                                        e.stopPropagation();
                                        onRightClick(e, file.id)
                                    }}
                                >
                                    <Info size="13px" className="shrink-0" color="#058ff9"/> 
                                    {editFileId === file.id ? (
                                        <input 
                                            autoFocus
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onBlur={() => commitRename(file.id)}
                                            onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                commitRename(file.id);
                                            }
                                            if (e.key === "Escape") {
                                                setEditFileId(null);
                                            }
                                            }}
                                            className="
                                            bg-transparent
                                            text-gray-100
                                            text-[11px]
                                            outline-none
                                            border-b
                                            border-blue-400
                                            w-full
                                            "
                                        />
                                    ) : (
                                        <span className="truncate text-[11px]">{file.name}</span>
                                    )}

                                    {dirty.fileId === file.id && dirty.isDirty && (
                                        <div className="w-2 h-2 bg-blue-400 rounded-full ml-auto mr-2"></div>
                                    )}
                                </div>
                            )
                        })}

                        {createNewFile && (
                            <div className="flex items-center gap-1 mx-2 p-1 rounded-md bg-[#3b3e3c]">
                                <TextAlignStart className="text-gray-400 w-4 h-4 shrink-0" />

                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="New file name"
                                    className="
                                        bg-transparent
                                        text-gray-100
                                        text-[11px]
                                        outline-none
                                        border-b
                                        border-gray-500
                                        focus:border-blue-400
                                        placeholder-gray-500
                                        w-full
                                    "
                                    onChange={(e) => {
                                        setFilename(e.target.value)
                                    }}
                                    onKeyDown={handleSubmit}
                                />
                            </div>
                        )}
                    </div>
                )}
                <div id="main-content" className="flex flex-col w-full h-full bg-[#242625] items-center justify-center">
                    {!selectedFile && <div className="text-[#1e1e1d] flex flex-col gap-4 items-center">
                        <FilePlusCorner size="200px"/>
                        <div className="text-[#8c948f] text-sm"> No notes selected </div>
                    </div>}
                    {selectedFile && <Editor fileId={selectedFile.id} fileName={selectedFile.name} blocks={blocks}/>}
                </div>
            </div>

            {/* render the context menu */}
            {menu && (
                <div
                    className="
                        fixed z-50 bg-[#2c2f2d] border border-[#434744] 
                        rounded shadow-md text-[11px] text-gray-200
                        "
                    style={{
                        top: menu.y,
                        left: menu.x,
                    }}
                >
                    <button 
                        className="block w-full px-3 py-1 hover:bg-[#3a3d3b] text-left cursor-pointer"
                        onClick={handleRename}
                    >
                        Rename
                    </button>
                    <button 
                        className="block w-full px-3 py-1 hover:bg-[#3a3d3b] text-left cursor-pointer"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}

export default Home;