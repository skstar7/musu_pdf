import type { UploadedFile } from "../../types";
import { Card } from "../ui/Card";

export function PDFPreview({ files }: { files: UploadedFile[] }) {
  if (!files.length) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold">Preview</h3>
      <p className="mt-2 text-xs text-muted">
        PDF.js integration is wired for Phase 3 rendering; current preview shows selected document metadata.
      </p>
      <div className="mt-3 space-y-2 text-sm">
        {files.map((file) => (
          <div key={file.id} className="rounded-lg border border-border bg-white px-3 py-2">
            {file.name}
          </div>
        ))}
      </div>
    </Card>
  );
}
