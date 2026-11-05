import { Card } from "../ui/Card";

export function EmptyState({ message }: { message: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted">{message}</p>
    </Card>
  );
}
