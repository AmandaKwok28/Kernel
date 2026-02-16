import type { FileType, FolderType } from "@/data/types";
import FolderRow from "./folderRow";
import FileRow from "./fileRow";
import { File } from "lucide-react";

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
    
    onSelectFolder: () => void;
    selectedFolderId: number | null;
    isSelected: boolean;
    setSelectedFolderId: (id: number | null) => void;

    // create new file props
    createNewFile: boolean;
    filename: string;
    setFilename: (v: string) => void;
    handleSubmitFile: (e: React.KeyboardEvent<HTMLInputElement>) => void;
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
  isFolderRenaming,
  onSelectFolder,
  isSelected,
  setSelectedFolderId,
  selectedFolderId,
  createNewFile,
  filename,
  setFilename,
  handleSubmitFile
}: Props) => {

  const isFileRenaming = (fileId: number) =>
    renameTarget?.type === "file" &&
    renameTarget.id === fileId;

  return (
    <div>
      <FolderRow
        name={folder.name}
        isOpen={isOpen}
        onToggle={() => {
          onSelectFolder();
          toggle();
        }}
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
        isSelected={isSelected}
        onSelect={() => {
          onSelectFolder();
        }}
      />

      {isOpen && (
        <div className="ml-3 mt-1">
          {createNewFile && selectedFolderId === folder.id && (
            <div className="flex items-center gap-2 px-2 py-[3px] mx-2 rounded-[4px] bg-[var(--bg-select-note)]">
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
          
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              isSelected={selectedFileId === file.id}
              isRenaming={isFileRenaming(file.id)} // file rename handled by parent with renameTarget
              isDirty={dirtyFileId === file.id}
              newName={newName}
              setNewName={setNewName}
              onClick={() => {
                selectFile(file)
                setSelectedFolderId(null);
              }}
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
