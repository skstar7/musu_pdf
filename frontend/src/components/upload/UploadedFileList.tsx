import type { DragEvent } from "react";
import { Trash2 } from "lucide-react";
import type { UploadedFile } from "../../types";
import { formatFileSize } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface UploadedFileListProps {
  files: UploadedFile[];
  onRemoveFile: (id: string) => void;
  enableReorder?: boolean;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

export function UploadedFileList({ files, onRemoveFile, enableReorder = false, onReorder }: UploadedFileListProps) {
  if (!files.length) {
    return null;
  }

  const handleDragStart = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.dataTransfer.setData("text/plain", String(index));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    const sourceIndex = Number(event.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(sourceIndex) && sourceIndex !== index && onReorder) {
      onReorder(sourceIndex, index);
    }
  };

  return (
    <div className="space-y-3">
      {files.map((item, index) => (
        <Card
          key={item.id}
          className="flex items-center justify-between gap-3 p-4"
          draggable={enableReorder}
          onDragStart={(event) => handleDragStart(event, index)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDrop(event, index)}
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
            <p className="mt-1 text-xs text-muted">
              {formatFileSize(item.size)} {item.pageCount ? `• ${item.pageCount} pages` : ""}
            </p>
            {enableReorder ? <p className="mt-1 text-[11px] text-muted">Drag to reorder</p> : null}
          </div>
          <Button variant="secondary" size="sm" onClick={() => onRemoveFile(item.id)}>
            <Trash2 size={14} className="mr-1" /> Remove
          </Button>
        </Card>
      ))}
    </div>
  );
}
