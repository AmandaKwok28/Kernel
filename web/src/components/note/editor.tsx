import type { BlockType } from "@/data/types";
import BlockRenderer from "./block-renderer";
import { useEffect, useRef, useState } from "react";
import { setDirtyState } from "@/lib/store";
import { Code, Pencil, TextAlignJustify, Trash } from "lucide-react";
import { useFiles } from "@/mutations/files";
import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableBlock from "./sortable-block";

type Props = {
    fileId: number;
    fileName: string;
    blocks: BlockType[];
}

const Editor = ({ fileId, fileName, blocks: initialBlocks } : Props ) => {

    const [blocks, setBlocks] = useState<BlockType[]>(initialBlocks);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());  // set for O(1) ops plus no dupe ids
    
    // mutations
    const { editFile } = useFiles();

    // refs
    const blocksRef = useRef<BlockType[]>(blocks);

    useEffect(() => {
        blocksRef.current = blocks;
    }, [blocks])

    useEffect(() => {
        setBlocks(initialBlocks);
        setSelectedIds(new Set());
        setEditMode(false);
        setDeleteMode(false);
    }, [fileId]);


    useEffect(() => {
        const handler = async () => {
            await editFile(fileId, undefined, blocksRef.current);
            setDirtyState({ fileId, isDirty: false });
        };

        window.app.onSave(handler);
    }, [fileId]);


    const updateBlock = (index: number, updated: BlockType) => {
        setBlocks((prev) =>
            prev.map((b, i) => (i === index ? updated : b))
        );
        setDirtyState({ fileId, isDirty: true})
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            return;
        }

        setBlocks((prev) => {
            const oldIndex = prev.findIndex((b) => b.id === active.id);
            const newIndex = prev.findIndex((b) => b.id === over.id);

            const updated = [...prev];
            const [moved] = updated.splice(oldIndex, 1);
            updated.splice(newIndex, 0, moved);

            return updated;
        });

        setDirtyState({ fileId, isDirty: true});
    }

    return (
        <div className="w-full h-full flex flex-col bg-[var(--bg-main)] p-4 overflow-x-hidden overflow-y-auto overscroll-none relative">
            <div className="w-full flex flex-row gap-8 mb-4 sticky top-0 z-20">
                <div 
                    id='note-title' 
                    className="
                        bg-[var(--bg-note-title)] 
                        w-fit 
                        px-4 
                        rounded-sm 
                        text-[25px] 
                        text-[var(--note-title-color)]
                    " 
                    style={{ fontFamily: "monospace"}}
                >
                    {fileName}
                </div>
                <div className="flex flex-row gap-2 h-full items-center">
                    <div 
                        title="add code"
                        className="text-gray-500 hover:text-[var(--hover-note-icon)]  cursor-pointer bg-[var(--bg-note-icon)] p-1 rounded-sm"
                        onClick={() => {
                            const newBlock: BlockType = {
                                id: crypto.randomUUID(),
                                type: "code",
                                language: "python",
                                code: "",
                            };

                            setBlocks((prev) => [...prev, newBlock]);
                            setDirtyState({ fileId, isDirty: true });
                        }}
                    >
                        <Code size={"15px"}/>
                    </div>
                    <div 
                        title="add text"
                        className="
                            text-gray-500 
                            hover:text-[var(--hover-note-icon)] 
                            cursor-pointer 
                            bg-[var(--bg-note-icon)] 
                            p-1 
                            rounded-sm
                        "
                        onClick={() => {
                            const newBlock: BlockType = {
                                id: crypto.randomUUID(),
                                type: "text",
                                content: "",
                            };

                            setBlocks((prev) => [...prev, newBlock]);
                            setDirtyState({ fileId, isDirty: true });
                        }}
                    >
                        <TextAlignJustify size={"15px"}/>
                    </div>
                    <div
                        className={`cursor-pointer bg-[var(--bg-note-icon)] p-1 rounded-sm ${
                            deleteMode ? "text-[var(--controls-select-color)]" : "text-gray-500 hover:text-[var(--hover-note-icon)] "
                        }`}
                        title="delete mode: select blocks to delete"
                        onClick={() => {
                            if (deleteMode) {
                                if (selectedIds.size === 0) {
                                    setDeleteMode(false);
                                    return;
                                }

                                setBlocks((prev) => {
                                    return prev.filter((b) => !selectedIds.has(b.id));
                                })

                                setSelectedIds(new Set());
                                setDeleteMode(false);
                                setDirtyState({ fileId, isDirty: true });
                            } else {
                                setDeleteMode(true);
                                setEditMode(false);
                            }
                        }}
                    >
                        <Trash size={15} />
                    </div>
                    <div
                        className={`cursor-pointer bg-[var(--bg-note-icon)] p-1 rounded-sm ${
                            editMode ? "text-[var(--controls-select-color)]" : "text-gray-500 hover:text-[var(--hover-note-icon)] "
                        }`}
                        title="edit mode: reorder blocks"
                        onClick={() => {
                            setEditMode(!editMode)
                            setDeleteMode(false);
                        }}
                    >
                        <Pencil size={15}/>
                    </div>
                </div>
            </div>
            
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={editMode && !deleteMode ? handleDragEnd : undefined}
            >
            <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-2 pb-[500px]">
                {blocks.map((block, i) => (
                    <SortableBlock 
                        key={block.id} 
                        id={block.id} 
                        enabled={editMode && !deleteMode}
                        deleteMode={deleteMode}
                        checked={selectedIds.has(block.id)}
                        onToggleCheck={() => {
                            setSelectedIds((prev) => {
                                const next = new Set(prev);
                                next.has(block.id) ? next.delete(block.id) : next.add(block.id);
                                return next;
                            });
                        }}
                    >
                        <BlockRenderer
                            fileId={fileId}
                            block={block}
                            onUpdate={(updated) => updateBlock(i, updated)}
                        />
                    </SortableBlock>
                ))}
                </div>
            </SortableContext>
            </DndContext>

        </div>
    )
}

export default Editor;