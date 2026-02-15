import { $fontFamily, $fontSize } from "@/lib/themes";
import { useStore } from "@nanostores/react";
import { ChevronRight } from "lucide-react";

type Props = {
  name: string;
  isOpen: boolean;
  onToggle: () => void;
  isDirty?: boolean;
};

const FolderRow = ({ name, isOpen, onToggle }: Props) => {

    const fontFamily = useStore($fontFamily);
    const fontSize = useStore($fontSize);

    return (
      <div
        onClick={onToggle}
        className="
          flex items-center gap-2 px-2 py-[3px] mx-2
          cursor-pointer rounded-[4px]
          hover:bg-[var(--bg-hover-note)]
        "
        style={{ fontFamily: fontFamily, fontSize: fontSize, color: "white"}}
      >
        <ChevronRight
          size={12}
          className={`transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
        <span className="truncate">{name}</span>
      </div>
    );
};

export default FolderRow;
