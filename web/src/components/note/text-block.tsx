import type { BlockType } from "@/data/types";
import { useEffect, useRef, useState } from "react";

type TextBlockType = Extract<BlockType, { type: "text" }>;

type Props = {
    block: TextBlockType;
    onUpdate: (updatedBlock: BlockType) => void;
}

const TEXT_SIZE = "9px";
const LINE_HEIGHT = "1.6";

// helpers
const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");


// basically an inline markdown highlighter. Performance is O(n) but since notes are small, it's fine
const highlight = (text: string) => {

    return text
        .split("\n")
        .map((line) => {
            
            let safe = escapeHtml(line);

            // highlight inline code: `code`
            safe = safe.replace(
                /`([^`]+)`/g,
                `<span class="px-1 rounded font-mono bg-[var(--code-highlight)] text-[var(--code-text-highlight)]">$1</span>`
            );

            // number list recognition
            const numberedMatch = safe.match(/^([\t ]*)(\d+\.)(\s*)(.*)$/);
            if (numberedMatch) {
                const [, indent, number, space, rest] = numberedMatch;

                return (
                    indent +
                    `<span class="text-[var(--number-highlight)]">${number}</span>` +
                    space +
                    rest
                );
            }

            // highlight dash list items
            const match = safe.match(/^([\t ]*)-(\s*)(.*)$/);

            if (match) {
            const [, indent, space, rest] = match;
            return (
                indent +
                `<span class="text-[var(--dash-highlight)]">•</span>` +
                space +
                rest
            );
            }

            return safe;
        })
        .join("\n");
};

const TextBlock = ({ block, onUpdate } : Props) => {

    // states
    const [value, setValue] = useState(block.content);

    // refs
    const mirrorRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // styling
    const textStyle = {
        fontSize: TEXT_SIZE,
        lineHeight: LINE_HEIGHT,
        fontFamily: "monospace",
        letterSpacing: "-0.03em",
        WebkitFontSmoothing: "antialiased" as const,  
    };

    // Sync when switching blocks
    useEffect(() => {
        setValue(block.content);
    }, [block.content]);

    useEffect(() => {
        if (!mirrorRef.current || !textareaRef.current) return;

        const height = mirrorRef.current.scrollHeight;
        textareaRef.current.style.height = `${height}px`;
    }, [value]);



    // tab handling
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        if (e.key === "Tab") {
            e.preventDefault();
            const updated =
                value.substring(0, start) +
                "\t" +
                value.substring(end);

            setValue(updated);
            onUpdate({ ...block, content: updated });

            requestAnimationFrame(() => {
                target.selectionStart = target.selectionEnd = start + 1;
            });
        }

        if (e.key === "Enter") {
            e.preventDefault();
            const lineStart = value.lastIndexOf("\n", start - 1) + 1;
            const line = value.slice(lineStart, start);
            const indent = line.match(/^[\t ]*/)?.[0] ?? "";

            const updated = value.substring(0, start) + "\n" + indent + value.substring(end);

            setValue(updated);
            onUpdate({ ...block, content: updated });

            requestAnimationFrame(() => {
                const pos = start + 1 + indent.length;
                target.selectionStart = target.selectionEnd = pos;
            });
        }
    };

    return (
        <div className={`relative w-full`} style={{backgroundColor: "var(--bg-main)"}}>

            <div
                ref={mirrorRef}
                className="whitespace-pre-wrap break-words px-4 invisible"
                style={textStyle}
            >
                {value + "\n"}
            </div>

            {/* Highlight layer */}
            <pre
                className="absolute inset-0 px-4 whitespace-pre-wrap break-words pointer-events-none text-[var(--note-text-color)]"
                style={textStyle}
                dangerouslySetInnerHTML={{ __html: highlight(value)}}
            />

            {/* Input layer */}
            <textarea
                autoFocus
                value={value}
                onChange={(e) => {
                    setValue(e.target.value)
                    onUpdate({ ...block, content: e.target.value})
                }}
                onKeyDown={handleKeyDown}
                placeholder="Start typing..."
                className="
                    absolute inset-0
                    w-full h-full
                    bg-transparent
                    resize-none
                    outline-none
                    text-transparent
                    caret-[var(--caret-color)]
                    px-4
                    "
                style={textStyle}
                spellCheck={false}
            />
        </div>
    )
}

export default TextBlock;