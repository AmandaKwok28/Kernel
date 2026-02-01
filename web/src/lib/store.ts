import type { BlockType, DirtyType, FileType } from "@/data/types";
import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

export const $files = persistentAtom<FileType[]>(
  "files",        // localStorage key
  [],             // default value
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
export const $dirty = atom<DirtyType>({fileId: -1, isDirty: false});

export function updateFileBlocks(fileId: number, blocks: BlockType[]) {
  $files.set(
    $files.get().map((file) =>
      file.id === fileId ? { ...file, blocks } : file
    )
  );
}

export function addBlock(fileId: number, block: BlockType) {
  $files.set(
    $files.get().map((file) =>
      file.id === fileId
        ? { ...file, blocks: [...file.blocks, block] }
        : file
    )
  );
}


export function setDirtyState(dirty: DirtyType) {
  $dirty.set(dirty);
}


// functions to set files
export function setFiles(files: FileType[]) {
  $files.set(files);
}

// function to update the set of files
export function addFile(file: FileType) {
  $files.set([...$files.get(), file]);
}

// set the updated file
export function addUpdatedFile(updated: FileType) {
  $files.set(
    $files.get().map((file) => {
      return file.id === updated.id ? updated : file
    })
  )
}

// function to delete a file
export function removeStoreFile(id: number) {
  $files.set(
    $files.get().filter((f) => f.id !== id)
  )
}