import { Download } from "lucide-react";
import { formatFileSize } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

interface DownloadResultProps {
  downloadUrl?: string;
  originalSizeBytes?: number;
  processedSizeBytes?: number;
  onProcessAnother: () => void;
}

export function DownloadResult({
  downloadUrl,
  originalSizeBytes,
  processedSizeBytes,
  onProcessAnother
}: DownloadResultProps) {
  return (
    <Card className="space-y-4 p-5">
      <div>
        <p className="text-lg font-semibold">Your file is ready</p>
        <p className="text-sm text-muted">Download the processed document or start a new operation.</p>
      </div>
      <div className="text-sm text-muted">
        <p>Original size: {originalSizeBytes ? formatFileSize(originalSizeBytes) : "N/A"}</p>
        <p>Processed size: {processedSizeBytes ? formatFileSize(processedSizeBytes) : "N/A"}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <a href={downloadUrl ?? "#"} target="_blank" rel="noreferrer">
            <Download size={16} className="mr-2" /> Download
          </a>
        </Button>
        <Button variant="secondary" onClick={onProcessAnother}>Process Another File</Button>
      </div>
    </Card>
  );
}
