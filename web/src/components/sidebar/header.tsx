import { FilePlusCorner, FolderPlus } from "lucide-react";

// this file takes care of the header icons in sidebar
type Props = {
    handleNewFile: () => void,
    hanldeNewFolder: () => void,
};

const SidebarHeader = ({ handleNewFile, hanldeNewFolder } : Props) => {

    const iconStyle = "cursor-pointer hover:text-[var(--hover-note-icon)] text-[var(--icon-color)]";

    return (
        <div className="flex flex-row w-full justify-end gap-2 p-4">
            <FilePlusCorner
                strokeWidth="1.5px"
                size="18px"
                onClick={handleNewFile}
                className={iconStyle}
            />
            <FolderPlus 
                strokeWidth="1.5px" 
                size="18px" 
                onClick={hanldeNewFolder}
                className={iconStyle}
            />
        </div>
    )
}

export default SidebarHeader;