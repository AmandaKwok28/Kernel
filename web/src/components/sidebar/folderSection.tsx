import type { FileType, FolderType } from "@/data/types";
import FolderRow from "./folderRow";
import FileRow from "./fileRow";

type MenuTarget =
  | { type: "file"; id: number }
  | { type: "folder"; id: number };

type Props = {
    folder: FolderType;
    files: FileType[];
    isOpen: boolean;
    toggle: () => void;

    selectedFileId: number | null;

    dirtyFileId: number | null;
    folderIsDirty: boolean;
    newName: string;
    setNewName: (v: string) => void;

    selectFile: (file: FileType) => void;
    onRightClick: (e: React.MouseEvent, target: MenuTarget) => void;

    commitRename: () => void;
    cancelRename: () => void;

    textStyle: React.CSSProperties;

    renameTarget: MenuTarget | null;   
    isFolderRenaming: boolean;
};

const FolderSection = ({
  folder,
  files,
  isOpen,
  toggle,
  selectedFileId,
  dirtyFileId,
  folderIsDirty,
  newName,
  setNewName,
  selectFile,
  onRightClick,
  commitRename,
  cancelRename,
  textStyle,
  renameTarget,
  isFolderRenaming
}: Props) => {

  const isFileRenaming = (fileId: number) =>
    renameTarget?.type === "file" &&
    renameTarget.id === fileId;

  return (
    <div>
      <FolderRow
        name={folder.name}
        isOpen={isOpen}
        onToggle={toggle}
        isDirty={folderIsDirty}
        isRenaming={isFolderRenaming}
        newName={newName}
        setNewName={setNewName}
        onCommitRename={commitRename}
        onCancelRename={cancelRename}
        onContextMenu={(e) =>
          onRightClick(e, { type: "folder", id: folder.id })
        }
        textStyle={textStyle}
      />


      {isOpen && (
        <div className="ml-3">
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              isSelected={selectedFileId === file.id}
              isRenaming={isFileRenaming(file.id)} // file rename handled by parent with renameTarget
              isDirty={dirtyFileId === file.id}
              newName={newName}
              setNewName={setNewName}
              onClick={() => selectFile(file)}
              onContextMenu={(e) => onRightClick(e, { type: "file", id: file.id })}
              onCommitRename={commitRename}
              onCancelRename={cancelRename}
              textStyle={textStyle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderSection;
