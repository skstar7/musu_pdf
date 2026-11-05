import type { ToolDefinition } from "../types";

export const toolCategories = [
  { key: "organize", label: "Organize PDF" },
  { key: "optimize", label: "Optimize PDF" },
  { key: "convert", label: "Convert PDF" },
  { key: "edit", label: "Edit PDF" },
  { key: "security", label: "PDF Security" },
  { key: "ai", label: "AI PDF Tools" }
] as const;

export const tools: ToolDefinition[] = [
  { slug: "merge-pdf", category: "organize", name: "Merge PDF", description: "Combine multiple PDFs into one document.", icon: "combine", route: "/tools/merge-pdf", supportsMultiple: true, endpoint: "/api/pdf/merge", requiresReorder: true, phase: "core" },
  { slug: "split-pdf", category: "organize", name: "Split PDF", description: "Split a PDF by page ranges or intervals.", icon: "split", route: "/tools/split-pdf", supportsMultiple: false, endpoint: "/api/pdf/split", requiresPageRange: true, configFields: [{ key: "pageRanges", label: "Page ranges", type: "text", required: true, placeholder: "e.g. 1-3,6,9-12" }], phase: "core" },
  { slug: "organize-pdf", category: "organize", name: "Organize Pages", description: "Reorder, duplicate, or remove PDF pages.", icon: "layout-grid", route: "/tools/organize-pdf", supportsMultiple: false, endpoint: "/api/pdf/organize", requiresReorder: true, phase: "core" },
  { slug: "remove-pages", category: "organize", name: "Remove Pages", description: "Delete selected pages from your PDF.", icon: "trash-2", route: "/tools/remove-pages", supportsMultiple: false, endpoint: "/api/pdf/organize", requiresPageRange: true, configFields: [{ key: "removePages", label: "Pages to remove", type: "text", required: true, placeholder: "e.g. 2,4-8" }], phase: "advanced" },
  { slug: "extract-pages", category: "organize", name: "Extract Pages", description: "Extract chosen pages into a new PDF.", icon: "scissors", route: "/tools/extract-pages", supportsMultiple: false, endpoint: "/api/pdf/split", requiresPageRange: true, configFields: [{ key: "extractPages", label: "Pages to extract", type: "text", required: true, placeholder: "e.g. 1,5-7" }], phase: "advanced" },
  { slug: "rotate-pdf", category: "organize", name: "Rotate PDF", description: "Rotate all or selected pages quickly.", icon: "rotate-cw", route: "/tools/rotate-pdf", supportsMultiple: false, endpoint: "/api/pdf/rotate", configFields: [{ key: "rotation", label: "Rotation", type: "select", required: true, options: [{ label: "90°", value: "90" }, { label: "180°", value: "180" }, { label: "270°", value: "270" }], defaultValue: "90" }], phase: "core" },
  { slug: "compress-pdf", category: "optimize", name: "Compress PDF", description: "Reduce file size while preserving quality.", icon: "shrink", route: "/tools/compress-pdf", supportsMultiple: false, endpoint: "/api/pdf/compress", configFields: [{ key: "level", label: "Compression level", type: "select", required: true, options: [{ label: "Low", value: "low" }, { label: "Balanced", value: "balanced" }, { label: "Strong", value: "strong" }], defaultValue: "balanced" }], phase: "core" },
  { slug: "repair-pdf", category: "optimize", name: "Repair PDF", description: "Attempt to recover corrupted PDF files.", icon: "wrench", route: "/tools/repair-pdf", supportsMultiple: false, phase: "advanced" },
  { slug: "ocr-pdf", category: "optimize", name: "OCR PDF", description: "Make scanned PDFs searchable with OCR.", icon: "scan-text", route: "/tools/ocr-pdf", supportsMultiple: false, endpoint: "/api/pdf/ocr", phase: "advanced" },
  { slug: "pdf-to-word", category: "convert", name: "PDF to Word", description: "Convert PDF into editable DOCX.", icon: "file-text", route: "/tools/pdf-to-word", supportsMultiple: false, endpoint: "/api/pdf/convert", phase: "advanced" },
  { slug: "word-to-pdf", category: "convert", name: "Word to PDF", description: "Convert DOCX files into PDF.", icon: "file-up", route: "/tools/word-to-pdf", supportsMultiple: true, endpoint: "/api/pdf/convert", phase: "advanced" },
  { slug: "pdf-to-excel", category: "convert", name: "PDF to Excel", description: "Extract tabular PDF content to XLSX.", icon: "sheet", route: "/tools/pdf-to-excel", supportsMultiple: false, endpoint: "/api/pdf/convert", phase: "advanced" },
  { slug: "excel-to-pdf", category: "convert", name: "Excel to PDF", description: "Convert XLS/XLSX sheets into PDF.", icon: "file-spreadsheet", route: "/tools/excel-to-pdf", supportsMultiple: true, endpoint: "/api/pdf/convert", phase: "advanced" },
  { slug: "pdf-to-jpg", category: "convert", name: "PDF to JPG", description: "Export PDF pages as JPG images.", icon: "image", route: "/tools/pdf-to-jpg", supportsMultiple: false, endpoint: "/api/pdf/convert", phase: "core" },
  { slug: "jpg-to-pdf", category: "convert", name: "JPG to PDF", description: "Combine JPG images into a PDF.", icon: "images", route: "/tools/jpg-to-pdf", supportsMultiple: true, endpoint: "/api/pdf/convert", phase: "core" },
  { slug: "pdf-to-powerpoint", category: "convert", name: "PDF to PowerPoint", description: "Convert PDF slides into PPTX.", icon: "presentation", route: "/tools/pdf-to-powerpoint", supportsMultiple: false, endpoint: "/api/pdf/convert", phase: "advanced" },
  { slug: "powerpoint-to-pdf", category: "convert", name: "PowerPoint to PDF", description: "Convert PPT/PPTX files into PDF.", icon: "monitor-up", route: "/tools/powerpoint-to-pdf", supportsMultiple: true, endpoint: "/api/pdf/convert", phase: "advanced" },
  { slug: "add-text", category: "edit", name: "Add Text", description: "Insert custom text into your PDF pages.", icon: "type", route: "/tools/add-text", supportsMultiple: false, phase: "advanced" },
  { slug: "add-images", category: "edit", name: "Add Images", description: "Place images and logos on PDFs.", icon: "image-plus", route: "/tools/add-images", supportsMultiple: false, phase: "advanced" },
  { slug: "add-watermark", category: "edit", name: "Add Watermark", description: "Apply text or image watermarks.", icon: "stamp", route: "/tools/add-watermark", supportsMultiple: false, endpoint: "/api/pdf/watermark", phase: "advanced" },
  { slug: "page-numbers", category: "edit", name: "Add Page Numbers", description: "Add automatic page numbering.", icon: "list-ordered", route: "/tools/page-numbers", supportsMultiple: false, phase: "advanced" },
  { slug: "crop-pdf", category: "edit", name: "Crop PDF", description: "Trim page margins or selected regions.", icon: "crop", route: "/tools/crop-pdf", supportsMultiple: false, phase: "advanced" },
  { slug: "sign-pdf", category: "edit", name: "Sign PDF", description: "Add secure signatures to PDF files.", icon: "pen-line", route: "/tools/sign-pdf", supportsMultiple: false, phase: "advanced" },
  { slug: "protect-pdf", category: "security", name: "Protect PDF", description: "Add password protection to your PDF.", icon: "lock", route: "/tools/protect-pdf", supportsMultiple: false, endpoint: "/api/pdf/protect", phase: "advanced" },
  { slug: "unlock-pdf", category: "security", name: "Unlock PDF", description: "Unlock a PDF with authorized password.", icon: "lock-open", route: "/tools/unlock-pdf", supportsMultiple: false, endpoint: "/api/pdf/unlock", phase: "advanced" },
  { slug: "redact-pdf", category: "security", name: "Redact PDF", description: "Permanently remove sensitive content.", icon: "shield-off", route: "/tools/redact-pdf", supportsMultiple: false, phase: "advanced" },
  { slug: "compare-pdf", category: "security", name: "Compare PDF", description: "Compare two PDFs and highlight differences.", icon: "git-compare", route: "/tools/compare-pdf", supportsMultiple: true, phase: "advanced" },
  { slug: "chat-with-pdf", category: "ai", name: "Chat with PDF", description: "Ask natural-language questions to your documents.", icon: "message-square", route: "/tools/chat-with-pdf", supportsMultiple: false, phase: "future" },
  { slug: "summarize-pdf", category: "ai", name: "Summarize PDF", description: "Generate concise summaries from long files.", icon: "sparkles", route: "/tools/summarize-pdf", supportsMultiple: false, phase: "future" },
  { slug: "translate-pdf", category: "ai", name: "Translate PDF", description: "Translate documents while preserving layout.", icon: "languages", route: "/tools/translate-pdf", supportsMultiple: false, phase: "future" },
  { slug: "extract-info", category: "ai", name: "Extract Information", description: "Pull entities and key fields from PDFs.", icon: "brain", route: "/tools/extract-info", supportsMultiple: false, phase: "future" }
];

export const popularTools = [
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "pdf-to-jpg",
  "jpg-to-pdf",
  "rotate-pdf"
];

export function findToolBySlug(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
