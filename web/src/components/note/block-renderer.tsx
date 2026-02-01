import type { BlockType } from "@/data/types";
import CodeBlock from "./code-block";
import TextBlock from "./text-block";

type Props = {
    fileId: number;
    block: BlockType;
    onUpdate: (updatedBlock: BlockType) => void;
}

const BlockRenderer = ({ fileId, block, onUpdate }: Props) => {
  switch (block.type) {
    case "text":
      return <TextBlock block={block} onUpdate={onUpdate} />;
    case "code":
      return <CodeBlock fileId={fileId} block={block} onUpdate={onUpdate} />;
  }
};

export default BlockRenderer;