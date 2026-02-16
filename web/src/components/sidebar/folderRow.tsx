import { ChevronRight } from "lucide-react";

type Props = {
  name: string;
  isOpen: boolean;
  onToggle: () => void;
  isDirty?: boolean;

  isRenaming: boolean;
  newName: string;
  setNewName: (v: string) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  onContextMenu: (e: React.MouseEvent) => void;

  textStyle: React.CSSProperties;
  isSelected: boolean;
  onSelect: () => void;
};

const FolderRow = ({
  name,
  isOpen,
  onToggle,
  isRenaming,
  newName,
  setNewName,
  onCommitRename,
  onCancelRename,
  onContextMenu,
  textStyle,
  isSelected,
  onSelect,
}: Props) => {

  
  return (
    <div
      className={`
        flex items-center gap-2 px-2 py-[3px] mx-2
        rounded-[4px]
        cursor-pointer
        hover:bg-[var(--bg-hover-note)]
        ${isSelected
          ? "bg-[var(--bg-select-note)]"
          : "hover:bg-[var(--bg-hover-note)]"
        }
      `}
      onContextMenu={onContextMenu}
      style={{ ...textStyle, color: "white" }}
      onClick={() => {
        onSelect();
        onToggle();
      }}
    >
      <ChevronRight
        size={12}
        className={`transition-transform cursor-pointer ${isOpen ? "rotate-90" : ""}`}
        color="var(--note-icon-color)"
      />
      {/* <Folder 
        size={12}
        color="var(--note-icon-color)"
      /> */}

      {isRenaming ? (
        <input
          autoFocus
          value={newName}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={onCommitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommitRename();
            if (e.key === "Escape") onCancelRename();
          }}
          className="
            bg-transparent
            outline-none
            border-b
            border-blue-400
            w-full
          "
        />
      ) : (
        <span
          className="truncate cursor-pointer text-[var(--font-color)]"
        >
          {name}
        </span>
      )}
    </div>
  );
};

export default FolderRow;
