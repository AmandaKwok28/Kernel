import type { FileType } from "@/data/types";
import { editFileContent, setDirty } from "@/lib/store";
import { useEffect, useState } from "react";

type Props = {
  note: FileType;
};


const TEXT_SIZE = "10.5px";
const LINE_HEIGHT = "1.6";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const highlight = (text: string) => {
  return text
    .split("\n")
    .map((line) => {
      const safe = escapeHtml(line);
      const match = safe.match(/^([\t ]*)-(.*)$/);

      if (match) {
        const [, indent, rest] = match;
        return `${indent}<span class="text-[#247afc]">-</span>${rest}`;
      }

      return safe;
    })
    .join("\n");
};



const Kfile = ({ note }: Props) => {
    const [fileContent, setFileContent] = useState(note.content);

    const textStyle = {
        fontSize: TEXT_SIZE,
        lineHeight: LINE_HEIGHT,
        fontFamily: "monospace",
        WebkitFontSmoothing: "antialiased" as const,
    };

    // Sync when switching notes
    useEffect(() => {
        setFileContent(note.content);
        setDirty({ fileId: note.id, isDirty: false });
    }, [note.name, note.content]);


    // Ctrl / Cmd + S save
    useEffect(() => {
        const handleSave = (e: KeyboardEvent) => {
        if (document.activeElement?.tagName !== "TEXTAREA") return;

        const isMac = navigator.platform.toUpperCase().includes("MAC");

        if (
            (isMac && e.metaKey && e.key === "s") ||
            (!isMac && e.ctrlKey && e.key === "s")
        ) {
            e.preventDefault();
            editFileContent(note.name, fileContent);
            setDirty({fileId: note.id, isDirty: false});
        }
        };

        window.addEventListener("keydown", handleSave);
        return () => window.removeEventListener("keydown", handleSave);
    }, [fileContent, note.name]);

    // Tab handling
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Tab") {
        e.preventDefault();

        const target = e.target as HTMLTextAreaElement;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        const updated =
            fileContent.substring(0, start) +
            "\t" +
            fileContent.substring(end);

        setFileContent(updated);

        requestAnimationFrame(() => {
            target.selectionStart = target.selectionEnd = start + 1;
        });
        }
    };

    return (
        <div className="relative w-full h-full bg-[#1e1e1d]">
        {/* Highlight layer */}
        <pre
            className="absolute inset-0 p-4 whitespace-pre-wrap break-words pointer-events-none text-gray-300"
            style={textStyle}
            dangerouslySetInnerHTML={{ __html: highlight(fileContent) }}
        />

        {/* Input layer */}
        <textarea
            autoFocus
            value={fileContent}
            onChange={(e) => {
                setFileContent(e.target.value)
                setDirty({fileId: note.id, isDirty: true});
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
                caret-gray-200
                p-4
                "
            style={textStyle}
        />
        </div>
    );
};

export default Kfile;
