import ThinSidebar from "./thin-sidebar";
import SidebarMenu from "./menu";
import type { FileType, FolderType } from "@/data/types";
import { useSidebarController } from "@/hook/useSidebarController";
import FileSidebar from "./file-sidebar";
import SearchSidebar from "./search-sidebar";

type Props = {
  files: FileType[];
  folders: FolderType[];
  selectedFileId: number | null;
  selectFile: (file: FileType) => void;
  dirty: { fileId: number | null; isDirty: boolean };
  textStyle: React.CSSProperties;
  setSelectedFileId: (id: number | null) => void;
};

const Sidebar = (props: Props) => {
  const c = useSidebarController({
    files: props.files,
    folders: props.folders,
    setSelectedFileId: props.setSelectedFileId,
  });

  return (
    <>
      <ThinSidebar
        open={c.open}
        active={c.mode}
        onToggleOpen={() => c.setOpen((o) => !o)}
        onSetActive={c.setMode}
      />

      {c.open && c.mode === "files" && (
        <FileSidebar
          {...props}
          // controller bits
          rootFiles={c.rootFiles}
          folderFilesById={c.folderFilesById}
          expandedFolders={c.expandedFolders}
          toggleFolder={c.toggleFolder}
          selectedFolderId={c.selectedFolderId}
          setSelectedFolderId={c.setSelectedFolderId}
          createNewFile={c.createNewFile}
          createNewFolder={c.createNewFolder}
          filename={c.filename}
          foldername={c.foldername}
          setFilename={c.setFilename}
          setFoldername={c.setFoldername}
          handleSubmitFile={c.handleSubmitFile}
          handleSubmitFolder={c.handleSubmitFolder}
          handleNewFile={c.handleNewFile}
          handleNewFolder={c.handleNewFolder}
          renameTarget={c.renameTarget}
          newName={c.newName}
          setNewName={c.setNewName}
          onRightClick={c.onRightClick}
          commitRename={c.commitRename}
          cancelRename={c.cancelRename}
          clearSelection={c.clearSelection}
        />
      )}

      {c.open && c.mode === "search" && (
        <SearchSidebar
          textStyle={props.textStyle}
        //   clearSelection={c.clearSelection}
          // later: search query, results, infinite scroll, etc
        />
      )}

      <SidebarMenu
        menu={c.menu}
        onClose={() => c.setMenu(null)}
        onRename={c.handleRename}
        onDelete={c.handleDelete}
      />
    </>
  );
};

export default Sidebar;