import { $theme } from "@/lib/themes";
import { useStore } from "@nanostores/react";
import { File, Search } from "lucide-react";

export type SidebarMode = "files" | "search";

type Props = {
    open: boolean;
    active: SidebarMode;
    onToggleOpen: () => void;
    onSetActive: (mode: SidebarMode) => void
}

const ThinSidebar = ({
    open,
    active,
    onToggleOpen,
    onSetActive
} : Props) => {

    const theme = useStore($theme);

    const handleClick = (mode: SidebarMode) => {
        if (active == mode) {
            onToggleOpen();
        } else {
            onSetActive(mode);
            if (!open) onToggleOpen();
        }
    };

    const iconClass = (mode: SidebarMode) =>
    `cursor-pointer ${
      active === mode
        ? "text-[var(--hover-note-icon)]"
        : "text-[var(--icon-color)] hover:text-[var(--hover-note-icon)]"
    }`;

    return (
        <div
            className="flex flex-col items-center w-[35px] bg-[var(--bg-sidebar)] h-full p-4 gap-4"
            style={{
                borderLeft: theme === "dark" ? "none" : "1px solid var(--border)",
                borderRight: theme === "dark" ? "none" : "1px solid var(--border)",
                borderBottom: theme === "dark" ? "none" : "1px solid var(--border)",
            }}
        >
            <div
                className={iconClass("files")}
                onClick={() => handleClick("files")}
            >
                <File strokeWidth="1.5px" size="20px" />
            </div>

            <div 
                className={iconClass("search")}
                onClick={() => handleClick("search")}
            >
                <Search strokeWidth="1.5px" size="20px" />
            </div>
        </div>
    )
}

export default ThinSidebar;