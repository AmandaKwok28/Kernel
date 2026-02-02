import type { BlockType } from "@/data/types";
import BlockRenderer from "./block-renderer";
import { useEffect, useState } from "react";
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
    
    // mutations
    const { editFile } = useFiles();

    useEffect(() => {
        setBlocks(initialBlocks);
    }, [fileId]);


    useEffect(() => {
        const handler = async () => {
            await editFile(fileId, undefined, blocks);
            setDirtyState({ fileId, isDirty: false });
        };

        window.app.onSave(handler);
    }, [blocks, fileId]);


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

    // #333433
    return (
        <div className="w-full h-full flex flex-col bg-[#1e1e1d] p-4 overflow-x-hidden overflow-y-auto overscroll-none">
            <div className="w-full flex flex-row gap-8 mb-4">
                <div id='note-title' className="bg-[#424442] w-[200px] px-4 py-1 rounded-sm text-[12px] text-white">
                    {fileName}
                </div>
                <div className="flex flex-row gap-2 h-full items-center">
                    <div 
                        title="add code"
                        className="text-gray-500 hover:text-white cursor-pointer bg-[#333433] p-1 rounded-sm"
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
                        className="text-gray-500 hover:text-white cursor-pointer bg-[#333433] p-1 rounded-sm"
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
                        className="text-gray-500 hover:text-white cursor-pointer bg-[#333433] p-1 rounded-sm"
                        title="delete mode: select blocks to delete"
                    >
                        <Trash size={15}/>
                    </div>
                    <div
                        className={`cursor-pointer bg-[#333433] p-1 rounded-sm ${
                            editMode ? "text-white" : "text-gray-500 hover:text-white"
                        }`}
                        title="edit mode: reorder blocks"
                        onClick={() => setEditMode((m) => !m)}
                    >
                        <Pencil size={15}/>
                    </div>
                </div>
            </div>
            
            <DndContext
                collisionDetection={closestCenter}
                onDragEnd={editMode ? handleDragEnd : undefined}
            >
            <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex flex-col gap-2 pb-[500px]">
                {blocks.map((block, i) => (
                    <SortableBlock key={block.id} id={block.id} enabled={editMode}>
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