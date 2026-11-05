import { Loader2 } from "lucide-react";
import { Card } from "../ui/Card";

export function ProcessingProgress({ status }: { status: string }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <Loader2 className="animate-spin" size={18} />
      <div>
        <p className="text-sm font-semibold">Processing in progress</p>
        <p className="text-xs text-muted">Current status: {status}</p>
      </div>
    </Card>
  );
}
