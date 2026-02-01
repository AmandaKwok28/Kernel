import type { BlockType } from "@/data/types";
import { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "@/styles/prism-github-dark.css";
import { Copy, Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";


type CodeBlockType = Extract<BlockType, { type: "code" }>;

type Props = {
    fileId: number;
    block: CodeBlockType;
    onUpdate: (updatedBlock: BlockType) => void;
};

const TEXT_SIZE = "10px";
const LINE_HEIGHT = "1.6";


const CodeBlock = ({ block, onUpdate }: Props) => {
    // local state
    const [code, setCode] = useState(block.code);
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

    // refs
    const codeMirrorRef = useRef<HTMLDivElement>(null);
    const outputMirrorRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // styling
    const textStyle = {
        fontSize: TEXT_SIZE,
        lineHeight: LINE_HEIGHT,
        fontFamily: "monospace",
        WebkitFontSmoothing: "antialiased" as const,
    };

    // keep local state in sync if block changes
    useEffect(() => {
        setCode(block.code);
    }, [block.code]);

    // auto-size height
    useEffect(() => {
        if (!codeMirrorRef.current || !textareaRef.current) return;
        textareaRef.current.style.height = `${codeMirrorRef.current.scrollHeight}px`;
    }, [code]);

    // tab handling
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;
        
        if (e.key === "Tab") {
            e.preventDefault();

            const updated = code.substring(0, start) + "\t" + code.substring(end);

            setCode(updated);
            onUpdate({ ...block, code: updated });

            requestAnimationFrame(() => {
                target.selectionStart = target.selectionEnd = start + 1;
            });

            return;
        }

        if (e.key === "Enter") {
            e.preventDefault();
            const lineStart = code.lastIndexOf("\n", start - 1) + 1;
            const line = code.slice(lineStart, start);
            const indent = line.match(/^[\t ]*/)?.[0] ?? "";

            const updated =
            code.substring(0, start) + "\n" + indent + code.substring(end);

            setCode(updated);
            onUpdate({ ...block, code: updated });

            requestAnimationFrame(() => {
                const pos = start + 1 + indent.length;
                target.selectionStart = target.selectionEnd = pos;
            });
        }
    };

    const handleRun = async () => {
        // const res = await runCell(code);
        // setOutput(res.stdout);
        // setError(res.stderr);

        try {
            const res = await window.kernel.run(code);

            if (!res.ok) {
                setError(res.error ?? "");
                setOutput("");
                return;
            }

            const output = (res.stdout ?? "") + (res.result ? `${res.result}\n` : "");

            setOutput(output);
            setError(res.stderr ?? "");
        } catch (err: any) {
            setError(err?.message ?? "Execution Error");
            setOutput("");
        }
        
    };

    const handleCopy = async () => {
        // come back to it
        try {
            await navigator.clipboard.writeText(code);
            toast("Copied to clipboard!")
        } catch (err) {
            console.error("Failed to copy", err);
        }
    }

    const handleCopyOutput = async () => {
        try {
            await navigator.clipboard.writeText(output);
            toast("Copied to clipboard!")
        } catch (err) {
            console.error("Failed to copy", err);
        }
    }

    const handleRefresh = async () => {
        await window.kernel.reset();
        setOutput("");
        setError("");
    }

    // #343335
    return (
        <div className="flex flex-row w-full gap-4">
            <div className="relative w-[500px] bg-[#151417] rounded-sm overflow-hidden ml-4">
                <div className="absolute top-2 right-2 z-20 flex gap-2">
                    <button
                        onClick={handleRun}
                        className="text-gray-400 hover:text-white transition cursor-pointer"
                        title="Run"
                    >
                        <Play size={16} />
                    </button>

                    <button
                        onClick={handleCopy}
                        className="text-gray-400 hover:text-white transition cursor-pointer"
                        title="Copy"
                    >
                        <Copy size={16} />
                    </button>

                    <button
                        onClick={handleRefresh}
                        className="text-gray-400 hover:text-white transition cursor-pointer"
                        title="Restart Kernel"
                    >
                        <RotateCcw size={16}/>
                    </button>
                </div>

                {/* height mirror */}
                <div
                    ref={codeMirrorRef}
                    className="pointer-events-none whitespace-pre-wrap break-words p-4"
                    style={textStyle}
                >
                    {code + "\n"}
                </div>

                {/* syntax-highlighted layer */}
                <div
                    className="absolute inset-0 p-4 pointer-events-none whitespace-pre-wrap break-words text-gray-200"
                    style={textStyle}
                    dangerouslySetInnerHTML={{
                        __html: Prism.highlight(code, Prism.languages.python, "python"),
                    }}
                />

                {/* textarea */}
                <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value);
                        onUpdate({ ...block, code: e.target.value });
                    }}
                    onKeyDown={handleKeyDown}
                    className="
                        leading-none
                        absolute inset-0
                        w-full
                        bg-transparent
                        resize-none
                        outline-none
                        caret-gray-200
                        text-transparent
                        p-4
                        z-10
                    "
                    style={textStyle}
                    spellCheck={false}
                />
            </div>
            
            {/* output block */}
            <div className="relative bg-[#343335] rounded-sm text-white flex-1 mr-4">

                <div className="absolute top-2 right-2 z-20 flex gap-2">
                    <button
                        onClick={handleCopyOutput}
                        className="text-gray-400 hover:text-white transition cursor-pointer"
                        title="Copy"
                    >
                        <Copy size={16} />
                    </button>
                </div>

                <div
                    ref={outputMirrorRef}
                    className="pointer-events-none whitespace-pre-wrap break-words p-4"
                    style={textStyle}
                >
                    {output + "\n" + error}
                </div>
            </div>
        </div>
    );

};

export default CodeBlock;
