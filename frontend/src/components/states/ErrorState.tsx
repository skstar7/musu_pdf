import { AlertTriangle } from "lucide-react";
import { Card } from "../ui/Card";

export function ErrorState({ message }: { message: string }) {
  return (
    <Card className="flex items-center gap-2 border-red-200 bg-red-50 p-4 text-red-800">
      <AlertTriangle size={16} />
      <p className="text-sm">{message}</p>
    </Card>
  );
}
