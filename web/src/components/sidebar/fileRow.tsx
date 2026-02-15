import type { FileType } from "@/data/types";
import { Info } from "lucide-react";

type Props = {
    file: FileType;
    isSelected: boolean;
    isRenaming: boolean;
    isDirty: boolean;

    newName: string;
    setNewName: (v: string) => void;

    onClick: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
    onCommitRename: () => void;
    onCancelRename: () => void;

    textStyle: React.CSSProperties;
}

const FileRow = ({
    file,
    isSelected,
    isRenaming,
    isDirty,
    newName,
    setNewName,
    onClick,
    onContextMenu,
    onCommitRename,
    onCancelRename,
    textStyle,
} : Props) => {
    return (
        <div
            className={`
                flex items-center gap-2 text-gray-200 text-[12px]
                cursor-pointer px-2 py-[3px] mx-2 rounded-[4px]
                ${isSelected
                    ? "bg-[var(--bg-select-note)]"
                    : "hover:bg-[var(--bg-hover-note)]"
                }
            `}
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            <Info size="13px" className="shrink-0" color="var(--note-icon-color)"/>

            {isRenaming ? (
                <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={onCommitRename}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onCommitRename();
                        if (e.key === "Escape") onCancelRename();
                    }}
                    className="
                        bg-transparent
                        text-[var(--font-color)]
                        outline-none
                        border-b
                        border-blue-400
                        w-full
                    "
                    style={textStyle}
                />
                ) : (
                    <span
                        className="truncate text-[var(--font-color)]"
                        style={textStyle}
                    >
                        {file.name}
                    </span>
                )}

                {isDirty && (
                    <div className="w-2 h-2 bg-[var(--dirty-color)] rounded-full ml-auto mr-2" />
                )}
        </div>
    )
}

export default FileRow;