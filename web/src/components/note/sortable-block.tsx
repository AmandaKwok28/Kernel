import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";


type Props = {
    id: string;
    children: React.ReactNode;
    enabled: boolean;
    deleteMode?: boolean;
    checked?: boolean;
    onToggleCheck?: () => void;
}

const SortableBlock = ({ 
    id, 
    children, 
    enabled, 
    deleteMode, 
    checked, 
    onToggleCheck 
}: Props ) => {

    const { 
        attributes, 
        listeners, 
        setNodeRef, 
        transform, 
        transition 
    } = useSortable({ id, disabled: !enabled });
    
    const style = {
        transform: transform
            ? CSS.Transform.toString({
                x: transform.x,
                y: transform.y,
                scaleX: 1,
                scaleY: 1,
            })
            : undefined,
        transition,
    };


    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                relative 
                ${enabled || deleteMode ? "pl-6" : ""}
                transition-[padding] duration-150
            `}
        >
            {/* drag handle */}
            {enabled && (
                <div
                    {...attributes}
                    {...listeners}
                    className="
                        absolute
                        left-2
                        top-1/2
                        -translate-y-1/2
                        text-gray-500 hover:text-white 
                        cursor-grab 
                        z-20 
                        select-none
                    "
                    title="Drag block"
                >
                    ⋮⋮
                </div>
            )}

            {deleteMode && (
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onToggleCheck}
                    className="
                        absolute
                        left-2
                        top-1/2
                        -translate-y-1/2
                        z-20
                    "
                    onClick={(e) => e.stopPropagation()} 
                />
            )}

            <div className="flex-1">
                {children}
            </div>
        </div>
  );
}

export default SortableBlock;