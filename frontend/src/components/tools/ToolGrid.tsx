import type { ToolDefinition } from "../../types";
import { ToolCard } from "./ToolCard";

export function ToolGrid({
  tools,
  emptyMessage = "No tools matched your filters."
}: {
  tools: ToolDefinition[];
  emptyMessage?: string;
}) {
  if (!tools.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.slug} tool={tool} />
      ))}
    </div>
  );
}
