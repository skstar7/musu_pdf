import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Footer } from "../../components/layout/Footer";
import { Navbar } from "../../components/layout/Navbar";
import { PageThumbnail } from "../../components/pdf/PageThumbnail";
import { PDFPreview } from "../../components/pdf/PDFPreview";
import { DownloadResult } from "../../components/states/DownloadResult";
import { EmptyState } from "../../components/states/EmptyState";
import { ErrorState } from "../../components/states/ErrorState";
import { ProcessingProgress } from "../../components/states/ProcessingProgress";
import { FileUploader } from "../../components/upload/FileUploader";
import { UploadedFileList } from "../../components/upload/UploadedFileList";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { findToolBySlug } from "../../config/tools";
import { getJobStatus, submitToolJob } from "../../services/api";
import type { ToolConfigField, UploadedFile, WorkflowStep } from "../../types";

function defaultConfig(fields: ToolConfigField[] | undefined): Record<string, unknown> {
  return (fields ?? []).reduce<Record<string, unknown>>((acc, field) => {
    acc[field.key] = field.defaultValue ?? (field.type === "checkbox" ? false : "");
    return acc;
  }, {});
}

function configStorageKey(slug: string) {
  return `musu:last-config:${slug}`;
}

function persistRecentTool(slug: string) {
  const key = "musu:recent-tools";
  const existing = window.localStorage.getItem(key);
  let parsed: string[] = [];
  if (existing) {
    try {
      parsed = JSON.parse(existing) as string[];
    } catch {
      parsed = [];
    }
  }
  const next = [slug, ...parsed.filter((item) => item !== slug)].slice(0, 8);
  window.localStorage.setItem(key, JSON.stringify(next));
}

export function ToolPage() {
  const { slug } = useParams();
  const tool = useMemo(() => findToolBySlug(slug ?? ""), [slug]);

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>("upload");
  const [config, setConfig] = useState<Record<string, unknown>>(defaultConfig(tool?.configFields));
  const [jobId, setJobId] = useState<string>();
  const [status, setStatus] = useState<string>("QUEUED");
  const [downloadUrl, setDownloadUrl] = useState<string>();
  const [sizes, setSizes] = useState<{ original?: number; processed?: number }>({});
  const [errorMessage, setErrorMessage] = useState<string>();
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pollingTimerRef = useRef<number | undefined>(undefined);

  const stopPolling = useCallback(() => {
    if (pollingTimerRef.current !== undefined) {
      window.clearTimeout(pollingTimerRef.current);
      pollingTimerRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  useEffect(() => {
    if (tool) {
      const savedConfig = window.localStorage.getItem(configStorageKey(tool.slug));
      let parsedConfig: Record<string, unknown> = {};
      if (savedConfig) {
        try {
          parsedConfig = JSON.parse(savedConfig) as Record<string, unknown>;
        } catch {
          parsedConfig = {};
        }
      }
      const initialConfig = { ...defaultConfig(tool.configFields), ...parsedConfig };
      setConfig(initialConfig);
      setSelectedPages([]);
      setFiles([]);
      setWorkflowStep("upload");
      setErrorMessage(undefined);
      setStatus("QUEUED");
      setJobId(undefined);
      setDownloadUrl(undefined);
      setSizes({});
      setIsSubmitting(false);
      stopPolling();
    }
  }, [tool, stopPolling]);

  useEffect(() => {
    if (!tool) {
      return;
    }
    window.localStorage.setItem(configStorageKey(tool.slug), JSON.stringify(config));
  }, [config, tool]);

  if (!tool) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto w-full max-w-3xl px-4 py-10">
          <ErrorState message="Tool not found." />
        </main>
        <Footer />
      </div>
    );
  }

  const handleFiles = (selectedFiles: File[]) => {
    const mapped: UploadedFile[] = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size
    }));

    setFiles((current) => (tool.supportsMultiple ? [...current, ...mapped] : mapped.slice(0, 1)));
    setWorkflowStep("configure");
  };

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((item) => item.id !== id));
  };

  const reorderFiles = (fromIndex: number, toIndex: number) => {
    setFiles((current) => {
      const clone = [...current];
      const [moved] = clone.splice(fromIndex, 1);
      clone.splice(toIndex, 0, moved);
      return clone;
    });
  };

  const togglePage = (pageNumber: number) => {
    setSelectedPages((current) => {
      if (current.includes(pageNumber)) {
        return current.filter((item) => item !== pageNumber);
      }
      return [...current, pageNumber].sort((a, b) => a - b);
    });
  };

  const pollJobStatus = useCallback(async (submittedJobId: string, attempt = 0, transientFailures = 0) => {
    try {
      const statusResponse = await getJobStatus(submittedJobId);
      if (!statusResponse.data) {
        return;
      }

      const nextStatus = statusResponse.data.status;
      setStatus(nextStatus);

      if (nextStatus === "COMPLETED") {
        setDownloadUrl(statusResponse.data.downloadUrl);
        setSizes({
          original: statusResponse.data.originalSizeBytes,
          processed: statusResponse.data.processedSizeBytes
        });
        setWorkflowStep("result");
        setIsSubmitting(false);
        stopPolling();
        return;
      }

      if (nextStatus === "FAILED") {
        setWorkflowStep("error");
        setErrorMessage(statusResponse.data.error ?? "Processing failed.");
        setIsSubmitting(false);
        stopPolling();
        return;
      }

      const nextDelayMs = Math.min(1400 + attempt * 300, 3200);
      pollingTimerRef.current = window.setTimeout(() => {
        void pollJobStatus(submittedJobId, attempt + 1, 0);
      }, nextDelayMs);
    } catch {
      if (transientFailures >= 2) {
        setWorkflowStep("error");
        setErrorMessage("Unable to fetch job updates. Please retry in a few seconds.");
        setIsSubmitting(false);
        stopPolling();
        return;
      }

      pollingTimerRef.current = window.setTimeout(() => {
        void pollJobStatus(submittedJobId, attempt + 1, transientFailures + 1);
      }, 1800);
    }
  }, [stopPolling]);

  const validateBeforeSubmit = (): string | null => {
    if (!files.length) {
      return "Please upload at least one file.";
    }

    if (!tool.configFields?.length) {
      return null;
    }

    for (const field of tool.configFields) {
      const value = config[field.key];
      if (field.required && field.type !== "checkbox" && String(value ?? "").trim().length === 0) {
        return `${field.label} is required.`;
      }
      if (field.type === "number" && String(value ?? "").trim().length > 0 && Number.isNaN(Number(value))) {
        return `${field.label} must be a valid number.`;
      }
    }

    return null;
  };

  const submit = async () => {
    if (isSubmitting) {
      return;
    }

    const validationError = validateBeforeSubmit();
    if (validationError) {
      setErrorMessage(validationError);
      setWorkflowStep("error");
      return;
    }

    try {
      stopPolling();
      setWorkflowStep("processing");
      setErrorMessage(undefined);
      setIsSubmitting(true);

      const payloadConfig = {
        ...config,
        pageOrder: selectedPages.length ? selectedPages.join(",") : config.pageOrder
      };

      const response = await submitToolJob(tool, files, payloadConfig);
      if (!response.success || !response.data) {
        setWorkflowStep("error");
        setErrorMessage(response.message);
        setIsSubmitting(false);
        return;
      }

      setJobId(response.data.jobId);
      setStatus(response.data.status);
      persistRecentTool(tool.slug);

      if (response.data.status === "COMPLETED") {
        setDownloadUrl(response.data.downloadUrl);
        setSizes({
          original: response.data.originalSizeBytes,
          processed: response.data.processedSizeBytes
        });
        setWorkflowStep("result");
        setIsSubmitting(false);
        return;
      }

      pollingTimerRef.current = window.setTimeout(() => {
        void pollJobStatus(response.data!.jobId);
      }, 1200);
    } catch (error) {
      stopPolling();
      setWorkflowStep("error");
      setErrorMessage((error as Error).message);
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    stopPolling();
    setFiles([]);
    setConfig(defaultConfig(tool.configFields));
    setWorkflowStep("upload");
    setJobId(undefined);
    setStatus("QUEUED");
    setDownloadUrl(undefined);
    setSizes({});
    setErrorMessage(undefined);
    setSelectedPages([]);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{tool.name}</h1>
          <p className="mt-2 text-sm text-muted">{tool.description}</p>
          {jobId ? <p className="mt-2 text-xs text-muted">Job ID: {jobId}</p> : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <FileUploader
              multiple={tool.supportsMultiple}
              accept={{
                "application/pdf": [".pdf"],
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
              }}
              onSelectFiles={handleFiles}
            />

            <UploadedFileList
              files={files}
              onRemoveFile={removeFile}
              enableReorder={tool.requiresReorder}
              onReorder={reorderFiles}
            />

            {tool.configFields?.length ? (
              <Card className="space-y-3 p-5">
                <p className="text-sm font-semibold">Configuration</p>
                {tool.configFields.map((field) => {
                  const value = config[field.key];
                  if (field.type === "select") {
                    return (
                      <div key={field.key}>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">{field.label}</label>
                        <Select
                          value={String(value ?? "")}
                          onChange={(event) =>
                            setConfig((current) => ({ ...current, [field.key]: event.target.value }))
                          }
                        >
                          {(field.options ?? []).map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </Select>
                      </div>
                    );
                  }

                  if (field.type === "checkbox") {
                    return (
                      <label key={field.key} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={Boolean(value)}
                          onChange={(event) =>
                            setConfig((current) => ({ ...current, [field.key]: event.target.checked }))
                          }
                        />
                        {field.label}
                      </label>
                    );
                  }

                  return (
                    <div key={field.key}>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted">{field.label}</label>
                      <Input
                        type={field.type === "number" ? "number" : "text"}
                        placeholder={field.placeholder}
                        value={String(value ?? "")}
                        onChange={(event) =>
                          setConfig((current) => ({ ...current, [field.key]: event.target.value }))
                        }
                      />
                    </div>
                  );
                })}
              </Card>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button onClick={submit} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : `Process ${tool.name}`}
              </Button>
              <Button variant="secondary" onClick={reset}>Reset</Button>
            </div>
          </div>

          <div className="space-y-4">
            <PDFPreview files={files} />
            {(tool.requiresPageRange || tool.requiresReorder) && files.length ? (
              <Card className="p-4">
                <p className="text-sm font-semibold">Page Selection</p>
                <p className="mt-1 text-xs text-muted">Select pages to build custom page order for page-based operations.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((pageNumber) => (
                    <PageThumbnail
                      key={pageNumber}
                      pageNumber={pageNumber}
                      selected={selectedPages.includes(pageNumber)}
                      onToggle={togglePage}
                    />
                  ))}
                </div>
              </Card>
            ) : null}
            {workflowStep === "upload" && <EmptyState message="Upload files to begin." />}
            {workflowStep === "processing" && <ProcessingProgress status={status} />}
            {workflowStep === "error" && <ErrorState message={errorMessage ?? "Something went wrong."} />}
            {workflowStep === "result" && (
              <DownloadResult
                downloadUrl={downloadUrl}
                originalSizeBytes={sizes.original}
                processedSizeBytes={sizes.processed}
                onProcessAnother={reset}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
