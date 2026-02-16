import { FilePlusCorner } from "lucide-react";
import { useState } from "react";
import { $dirty, $files, $folders } from "@/lib/store";
import { useStore } from "@nanostores/react";
import type { FileType } from "@/data/types";
import Editor from "@/components/note/editor";
import { $fontFamily, $fontSize, $theme, setTheme } from "@/lib/themes";
import { Switch } from "@/components/ui/switch";
import Sidebar from "@/components/sidebar/sidebar";


// add folder support later
const Home = () => {

    // stored data
    const files = useStore($files);
    const folders = useStore($folders);                
    const dirty = useStore($dirty);                    // many files can be dirty at once... fix this later
    const fontSize = useStore($fontSize);              // keep the font size, family consistant across the app
    const fontFamily = useStore($fontFamily);
    const theme = useStore($theme);                    // indicates mode: ["light", "dark"]

    // local state    
                                           // file name of the file being created
    const [selectedFileId, setSelectedFileId] = useState<number | null>(null);              // indicates which file the editor needs to render
    // style
    const textStyle = {
        fontSize,
        fontFamily
    }

    const selectedFile: FileType | null =
    files.find((f) => f.id === selectedFileId) ?? null;


    const selectFile = (file: FileType) => {
        if (file.id !== selectedFileId) {
            setSelectedFileId(file.id);
        } else {
            setSelectedFileId(null);
        }
    };

    const blocks = selectedFile ? selectedFile.blocks : [];

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <div 
                id='header' 
                className="flex min-w-screen h-[25px] bg-[var(--bg-header)] items-center justify-between px-2" 
                style={{ 
                    border: theme === "dark" ? "" : "1px solid",
                    borderColor: theme === "dark" ? "" : "var(--border)"
                }}
            > 
                <div />  
                <div title='theme toggle'>
                    <Switch 
                        size="sm" 
                        className="cursor-pointer"
                        onClick={(e) => {
                            setTheme(theme === "dark" ? "light" : "dark");
                            e.stopPropagation();
                        }}
                    />
                </div>
            </div>

            <div id="main-body" className="flex flex-row flex-1 w-full overflow-hidden">
                <Sidebar
                    files={files}
                    folders={folders}
                    selectedFileId={selectedFileId}
                    selectFile={selectFile}
                    dirty={dirty}
                    theme={theme}
                    textStyle={textStyle}
                    setSelectedFileId={setSelectedFileId}
                />
                <div id="main-content" className="flex flex-col w-full h-full bg-[var(--bg-main)] items-center justify-center">
                    {!selectedFile && <div className="flex flex-col gap-4 items-center text-[var(--file-plus-color)]">
                        <FilePlusCorner strokeWidth="1px" size="200px"/>
                        <div className="text-[var(--bg-font-color)] text-[12px]" style={{fontFamily: "monospace"}}> No notes selected </div>
                    </div>}
                    {selectedFile && (
                        <Editor 
                            key={selectedFile.id}
                            fileId={selectedFile.id} 
                            fileName={selectedFile.name} 
                            blocks={blocks}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home;