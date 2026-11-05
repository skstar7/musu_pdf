import {
  Brain,
  Combine,
  Crop,
  FileSpreadsheet,
  FileText,
  FileUp,
  GitCompare,
  Image,
  ImagePlus,
  Images,
  Languages,
  LayoutGrid,
  ListOrdered,
  Lock,
  LockOpen,
  MessageSquare,
  MonitorUp,
  PenLine,
  Presentation,
  RotateCw,
  ScanText,
  Scissors,
  ShieldOff,
  Shrink,
  Sparkles,
  Split,
  Stamp,
  Trash2,
  Type,
  Wrench
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  combine: Combine,
  split: Split,
  "layout-grid": LayoutGrid,
  "trash-2": Trash2,
  scissors: Scissors,
  "rotate-cw": RotateCw,
  shrink: Shrink,
  wrench: Wrench,
  "scan-text": ScanText,
  "file-text": FileText,
  "file-up": FileUp,
  sheet: FileSpreadsheet,
  "file-spreadsheet": FileSpreadsheet,
  image: Image,
  images: Images,
  presentation: Presentation,
  "monitor-up": MonitorUp,
  type: Type,
  "image-plus": ImagePlus,
  stamp: Stamp,
  "list-ordered": ListOrdered,
  crop: Crop,
  "pen-line": PenLine,
  lock: Lock,
  "lock-open": LockOpen,
  "shield-off": ShieldOff,
  "git-compare": GitCompare,
  "message-square": MessageSquare,
  sparkles: Sparkles,
  languages: Languages,
  brain: Brain
};

export function IconForTool({ icon, size = 18 }: { icon: string; size?: number }) {
  const Comp = iconMap[icon] ?? FileText;
  return <Comp size={size} />;
}
