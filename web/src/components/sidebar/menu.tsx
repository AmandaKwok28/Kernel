import { $fontSize } from "@/lib/themes";
import { useStore } from "@nanostores/react";


export type MenuTarget =
  | { type: "file"; id: number }
  | { type: "folder"; id: number };

export type MenuType = {
  x: number;
  y: number;
  target: MenuTarget;
};

type Props = {
    menu: MenuType | null;
    onClose: () => void;
    onRename: (target: MenuTarget) => void;
    onDelete: (target: MenuTarget) => void;
}

const SidebarMenu = ({
    menu,
    onClose,
    onRename,
    onDelete
} : Props ) => {

    // store
    const fontSize = useStore($fontSize);

    if (!menu) return null;

    return (
        <div
            className="
                fixed z-50 bg-[#2c2f2d] border border-[#434744] 
                rounded shadow-md text-[11px] text-gray-200
            "
            style={{
                top: menu.y,
                left: menu.x,
                fontFamily: "monospace",
                fontSize,
            }}
        >
            <button
                className="block w-full px-3 py-1 hover:bg-[#3a3d3b] text-left cursor-pointer"
                onClick={() => {
                    onRename(menu.target);
                    onClose();
                }}
            >
                Rename
            </button>

            <button
                className="block w-full px-3 py-1 hover:bg-[#3a3d3b] text-left cursor-pointer"
                onClick={() => {
                    onDelete(menu.target);
                    onClose();
                }}
            >
                Delete
            </button>
        </div>
    );
}

export default SidebarMenu;