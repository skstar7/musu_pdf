export type ToolCategory =
  | "organize"
  | "optimize"
  | "convert"
  | "edit"
  | "security"
  | "ai";

export type WorkflowStep =
  | "upload"
  | "configure"
  | "processing"
  | "result"
  | "error";

export interface ToolConfigField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "checkbox";
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  defaultValue?: string | number | boolean;
}

export interface ToolDefinition {
  slug: string;
  category: ToolCategory;
  name: string;
  description: string;
  icon: string;
  route: string;
  supportsMultiple: boolean;
  endpoint?: string;
  requiresPageRange?: boolean;
  requiresReorder?: boolean;
  configFields?: ToolConfigField[];
  phase: "core" | "advanced" | "future";
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  previewUrl?: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
  timestamp: string;
}

export interface JobResponse {
  jobId: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  downloadUrl?: string;
  originalSizeBytes?: number;
  processedSizeBytes?: number;
  error?: string;
}
