import { File, Folder } from "lucide-react";
import FolderSection from "./folderSection";
import FileRow from "./fileRow";
import SidebarHeader from "./header";
import type { FileType, FolderType } from "@/data/types";
import type { MenuTarget } from "./menu";

type Props = {
  // data
  files: FileType[];
  folders: FolderType[];
  rootFiles: FileType[];
  folderFilesById: Map<number, FileType[]>;

  // selection
  selectedFileId: number | null;
  selectedFolderId: number | null;
  setSelectedFolderId: (id: number | null) => void;
  selectFile: (file: FileType) => void;
  setSelectedFileId: (id: number | null) => void;

  // folder UI
  expandedFolders: Set<number>;
  toggleFolder: (id: number) => void;

  // rename
  renameTarget: MenuTarget | null;
  newName: string;
  setNewName: (name: string) => void;
  commitRename: () => void;
  cancelRename: () => void;

  // context menu
  onRightClick: (e: React.MouseEvent, target: MenuTarget) => void;

  // create
  createNewFile: boolean;
  createNewFolder: boolean;
  filename: string;
  foldername: string;
  setFilename: (v: string) => void;
  setFoldername: (v: string) => void;
  handleSubmitFile: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSubmitFolder: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleNewFile: () => void;
  handleNewFolder: () => void;

  // misc
  dirty: { fileId: number | null; isDirty: boolean };
  textStyle: React.CSSProperties;
  clearSelection: () => void;
};

const FileSidebar = ({
  folders,
  rootFiles,
  folderFilesById,

  selectedFileId,
  selectedFolderId,
  setSelectedFolderId,
  selectFile,
  setSelectedFileId,

  expandedFolders,
  toggleFolder,

  renameTarget,
  newName,
  setNewName,
  commitRename,
  cancelRename,

  onRightClick,

  createNewFile,
  createNewFolder,
  filename,
  foldername,
  setFilename,
  setFoldername,
  handleSubmitFile,
  handleSubmitFolder,
  handleNewFile,
  handleNewFolder,

  dirty,
  textStyle,
  clearSelection,
}: Props) => {
  return (
    <div
      className="flex flex-col h-full w-[300px] bg-[var(--bg-open-sidebar)] gap-1"
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        clearSelection();
      }}
    >
      <SidebarHeader
        handleNewFile={handleNewFile}
        hanldeNewFolder={handleNewFolder}
      />

      {/* Create File (Root Only) */}
      {selectedFolderId === null && createNewFile && (
        <div className="flex items-center gap-2 mx-2 px-2 py-1 rounded-[4px] bg-[var(--bg-select-note)]">
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

      {/* Root Files */}
      {rootFiles.map((file) => {
        const isRenaming =
          renameTarget?.type === "file" &&
          renameTarget.id === file.id;

        return (
          <FileRow
            key={file.id}
            file={file}
            isSelected={selectedFileId === file.id}
            isRenaming={isRenaming}
            isDirty={dirty.fileId === file.id && dirty.isDirty}
            newName={newName}
            setNewName={setNewName}
            onClick={() => {
              selectFile(file);
              setSelectedFolderId(null);
            }}
            onContextMenu={(e) =>
              onRightClick(e, { type: "file", id: file.id })
            }
            onCommitRename={commitRename}
            onCancelRename={cancelRename}
            textStyle={textStyle}
          />
        );
      })}

      {/* Folders */}
      {folders.map((folder) => {
        const folderFiles = folderFilesById.get(folder.id) ?? [];

        const folderIsDirty = folderFiles.some(
          (f) => dirty.fileId === f.id && dirty.isDirty
        );

        const isFolderRenaming =
          renameTarget?.type === "folder" &&
          renameTarget.id === folder.id;

        const isSelected = selectedFolderId === folder.id;

        return (
          <FolderSection
            key={folder.id}
            folder={folder}
            files={folderFiles}
            isOpen={expandedFolders.has(folder.id)}
            toggle={() => toggleFolder(folder.id)}
            selectedFileId={selectedFileId}
            dirtyFileId={dirty.fileId}
            folderIsDirty={folderIsDirty}
            newName={newName}
            setNewName={setNewName}
            selectFile={selectFile}
            onRightClick={onRightClick}
            commitRename={commitRename}
            cancelRename={cancelRename}
            textStyle={textStyle}
            renameTarget={renameTarget}
            isFolderRenaming={isFolderRenaming}
            onSelectFolder={() => {
              setSelectedFolderId(folder.id);
              setSelectedFileId(null);
            }}
            selectedFolderId={selectedFolderId}
            isSelected={isSelected}
            setSelectedFolderId={setSelectedFolderId}
            createNewFile={createNewFile}
            filename={filename}
            setFilename={setFilename}
            handleSubmitFile={handleSubmitFile}
          />
        );
      })}

      {/* Create Folder */}
      {createNewFolder && (
        <div className="flex items-center gap-2 mx-2 py-1 px-2 rounded-[4px] bg-[var(--bg-select-note)]">
          <Folder size="13px" className="shrink-0 text-[var(--new-folder-icon)]" />
          <input
            type="text"
            autoFocus
            placeholder="New folder name"
            className="bg-transparent outline-none border-b w-full text-[var(--create-text-color)]"
            value={foldername}
            onChange={(e) => setFoldername(e.target.value)}
            onKeyDown={handleSubmitFolder}
            style={textStyle}
          />
        </div>
      )}
    </div>
  );
};

export default FileSidebar;