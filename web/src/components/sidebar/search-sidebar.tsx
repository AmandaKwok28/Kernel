import { Ban, File, Folder, RotateCw } from "lucide-react";
import { useRef, useState, type ChangeEvent, type CSSProperties } from "react";
import { Textarea } from "../ui/textarea";
import { useFiles } from "@/mutations/files";
import type { FileType, FolderType } from "@/data/types";

type Props = {
    textStyle: CSSProperties;
}

const SearchSidebar = ({
    textStyle
} : Props) => {

    // state
    const [query, setQuery] = useState<string>("");
    const [files, setFiles] = useState<FileType[]>([]);
    const [folders, setFolders] = useState<FolderType[]>([]);


    // mutations
    const { searchFiles } = useFiles()

    // a ref is how you directly access a DOM element
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = () => {
        const el = textareaRef.current;                 // get the current textArea element
        if (!el) return;                                // if it's not rendered, return
        el.style.height = "auto";                       // set its height to auto
        el.style.height = `${el.scrollHeight}px`;       // scrollHeight = total height needed to fit content without a scrollbar
    }

    const handleInputChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {

        setQuery(e.target.value);

        // search for the related files / folders and display them
        const [files, folders] = await searchFiles(e.target.value);
        setFiles(
            (files ?? []).filter(
                (f): f is FileType => f !== null
            )
        );
        setFolders(
            (folders ?? []).filter(
                (f): f is FolderType => f !== null
            )
        );
        
    }

    return (
        <div 
            className="flex flex-col h-full w-[300px] bg-[var(--bg-open-sidebar)] gap-1"
        >
            {/* header / title */}
            <div className="flex flex-row justify-between align-center p-2">
                <p 
                    style={{
                        fontSize: '10px',
                        color: 'var(--icon-color)'
                    }}
                > SEARCH </p>

                <div className="flex flex-row gap-1">
                    <div title="refresh search">
                        <RotateCw color="var(--icon-color)" size={"13px"} cursor={'pointer'}/>
                    </div>
                    <div title="clear search">
                        <Ban color="var(--icon-color)" size={"13px"} cursor={'pointer'}/>
                    </div>
                </div>
            </div>

            {/* search bar */}
            <div className="flex w-full min-w-0 px-2 text-[var(--icon-color)]">
                <Textarea
                    ref={textareaRef}
                    onInput={handleInput}
                    value={query}
                    onChange={handleInputChange}
                    className="
                        flex-1
                        w-full
                        min-w-0
                        px-2
                        py-1
                        min-h-6
                        max-h-20
                        max-w-[182px]
                        leading-tight
                        rounded-[4px]
                        resize-none
                        overflow-hidden
                        whitespace-pre-wrap
                        break-words
                        focus-visible:ring-1
                        focus-visible:ring-blue-500
                        focus-visible:border-blue-500
                    "
                    style={textStyle}
                />
            </div>

            {/* display the files found in search */}
            <div className="flex flex-col gap-1 px-2 overflow-y-auto">

                {query && files.length === 0 && folders.length === 0 && (
                    <div style={textStyle} className="text-[var(--icon-color)] flex flex-row justify-center p-2"> 
                        No results found. 
                    </div>
                )}

                {files.length > 0 && (
                    <>
                    <p className="text-[10px] opacity-60 mt-2 text-[var(--icon-color)]">FILES</p>
                    {files.map(file => (
                        <div
                            key={file.id}
                            className="
                                flex flex-row text-sm px-2 py-1 rounded 
                                hover:bg-[var(--bg-hover-note)] cursor-pointer 
                                gap-1
                            "
                        >
                            <File size="13px" className="shrink-0" color="var(--note-icon-color)"/>
                            <span
                                className="truncate text-[var(--font-color)]"
                                style={textStyle}
                            >
                                {file.name}
                            </span>
                        </div>
                    ))}
                    </>
                )}

                {folders.length > 0 && (
                    <>
                        <p className="text-[10px] opacity-60 mt-2 text-[var(--icon-color)]">FOLDERS</p>
                        {folders.map(folder => (
                            <div
                                key={folder.id}
                                className="
                                    flex flex-row text-sm px-2 py-1 rounded 
                                    hover:bg-[var(--bg-hover-note)] cursor-pointer
                                    gap-1
                                "
                            >   
                                <Folder 
                                    size="13px"
                                    color="var(--note-icon-color)"
                                />
                                <span
                                    className="truncate cursor-pointer text-[var(--font-color)]"
                                    style={textStyle}
                                >
                                    {folder.name}
                                </span>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default SearchSidebar;