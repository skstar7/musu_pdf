import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { Button } from "../ui/Button";

interface FileUploaderProps {
  multiple: boolean;
  accept: Record<string, string[]>;
  onSelectFiles: (files: File[]) => void;
}

export function FileUploader({ multiple, accept, onSelectFiles }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onSelectFiles(acceptedFiles);
      }
    },
    [onSelectFiles]
  );

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept,
    noClick: true,
    noKeyboard: true
  });

  return (
    <div
      {...getRootProps()}
      className="rounded-2xl border border-dashed border-border bg-card p-8 text-center transition hover:border-zinc-400"
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white border border-border">
        <UploadCloud size={20} />
      </div>
      <p className="text-lg font-semibold tracking-tight">
        {isDragActive ? "Drop your files here" : "Drag and drop your files"}
      </p>
      <p className="mt-2 text-sm text-muted">Supports PDF and related formats depending on selected tool.</p>
      <div className="mt-5 flex justify-center">
        <Button type="button" onClick={open}>Browse Files</Button>
      </div>
      <p className="mt-3 text-xs text-muted">Multiple upload: {multiple ? "enabled" : "disabled"}</p>
    </div>
  );
}
