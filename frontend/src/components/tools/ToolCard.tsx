import { Link } from "react-router-dom";
import type { ToolDefinition } from "../../types";
import { Card } from "../ui/Card";
import { IconForTool } from "./IconForTool";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const phaseLabel = tool.phase === "core" ? "Core" : tool.phase === "advanced" ? "Advanced" : "Coming Soon";

  return (
    <Link to={tool.route}>
      <Card className="group h-full p-5 transition hover:-translate-y-0.5 hover:bg-white">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-foreground">
            <IconForTool icon={tool.icon} />
          </div>
          <span className="rounded-full border border-border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
            {phaseLabel}
          </span>
        </div>
        <h3 className="text-base font-semibold tracking-tight">{tool.name}</h3>
        <p className="mt-2 text-sm text-muted">{tool.description}</p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-foreground/80">Open Tool</p>
      </Card>
    </Link>
  );
}
