import type { ApiEnvelope, JobResponse, ToolDefinition, UploadedFile } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const REQUEST_TIMEOUT_MS = 30_000;

async function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const body = (await response.json()) as { message?: string; errorCode?: string };
      if (body.message) {
        return body.errorCode ? `${body.message} (${body.errorCode})` : body.message;
      }
    } catch {
      return fallback;
    }
  }

  try {
    const text = await response.text();
    return text || fallback;
  } catch {
    return fallback;
  }
}

export async function submitToolJob(
  tool: ToolDefinition,
  files: UploadedFile[],
  configuration: Record<string, unknown>
): Promise<ApiEnvelope<JobResponse>> {
  if (!tool.endpoint) {
    return {
      success: false,
      message: "This tool is planned for a future phase.",
      errorCode: "NOT_IMPLEMENTED",
      timestamp: new Date().toISOString()
    };
  }

  const formData = new FormData();
  files.forEach((uploadedFile) => formData.append("files", uploadedFile.file));
  formData.append("toolSlug", tool.slug);
  formData.append("configuration", JSON.stringify(configuration));

  const response = await fetchWithTimeout(`${API_BASE_URL}${tool.endpoint}`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errorMessage = await parseErrorMessage(response, "Unable to submit processing request.");
    throw new Error(errorMessage);
  }

  return response.json() as Promise<ApiEnvelope<JobResponse>>;
}

export async function getJobStatus(jobId: string): Promise<ApiEnvelope<JobResponse>> {
  const response = await fetchWithTimeout(`${API_BASE_URL}/api/jobs/${jobId}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    const errorMessage = await parseErrorMessage(response, "Unable to fetch job status.");
    throw new Error(errorMessage);
  }

  return response.json() as Promise<ApiEnvelope<JobResponse>>;
}
