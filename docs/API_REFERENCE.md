# API Reference

## Base URL

- Local: `http://localhost:8080`
- All API routes are under `/api`.

Runtime note:
- Backend supports `JOB_STORE_MODE=memory` for local fallback without MongoDB.
- In memory mode, job/status data is lost on backend restart.

## Common Response Envelope

Every JSON endpoint returns:

```json
{
  "success": true,
  "message": "Job submitted",
  "data": {},
  "errorCode": null,
  "timestamp": "2026-10-31T16:00:00Z"
}
```

Fields:
- `success`: boolean
- `message`: user-readable summary
- `data`: payload object
- `errorCode`: present when `success=false`
- `timestamp`: ISO-8601 server timestamp

## Authentication

Current state:
- API routes are presently open for development setup.
- Security framework is present and prepared for auth integration.

## Content Types

- Submit endpoints: `multipart/form-data`
- Status endpoint: `application/json`
- Download endpoint: binary file stream

## Job Status Enum

- `QUEUED`
- `PROCESSING`
- `COMPLETED`
- `FAILED`

## Endpoints

### 1) Submit Operations

#### POST /api/pdf/merge

Description:
- Merge multiple PDF files into one output.

Form fields:
- `files` (required, multiple)
- `configuration` (optional JSON string)

Example:
```bash
curl -X POST "http://localhost:8080/api/pdf/merge" \
  -F "files=@a.pdf" \
  -F "files=@b.pdf" \
  -F "configuration={\"toolSlug\":\"merge-pdf\"}"
```

#### POST /api/pdf/split

Description:
- Split/extract pages from a PDF based on page ranges.

Form fields:
- `files` (required, single PDF expected)
- `configuration` (optional JSON string)

Relevant config keys:
- `pageRanges`: string like `1-3,5,8-10`
- `extractPages`: string like `2,7-9`

#### POST /api/pdf/compress

Description:
- Compress PDF with configurable level.

Config keys:
- `level`: `low | balanced | strong`

#### POST /api/pdf/rotate

Description:
- Rotate PDF pages.

Config keys:
- `rotation`: `90 | 180 | 270`

#### POST /api/pdf/convert

Description:
- Generic conversion endpoint used by multiple tools.

Form fields:
- `files` (required)
- `toolSlug` (required)
- `configuration` (optional JSON string)

Core currently supported slugs:
- `jpg-to-pdf`
- `pdf-to-jpg`

Additional slugs exist in frontend registry for future implementation.

#### POST /api/pdf/organize

Description:
- Organize/reorder PDF pages.

Config keys:
- `pageOrder`: string like `3,1,2,4`

#### POST /api/pdf/watermark

Description:
- Add basic text watermark.

Config keys:
- `text`: watermark text

#### POST /api/pdf/protect

Description:
- Password-protect PDF.

Config keys:
- `password`

#### POST /api/pdf/unlock

Description:
- Unlock encrypted PDF using password.

Config keys:
- `password`

#### POST /api/pdf/ocr

Description:
- Reserved endpoint for OCR workflow (future phase expansion).

### 2) Job Tracking

#### GET /api/jobs/{jobId}

Description:
- Fetch current job state.

Success data shape:

```json
{
  "jobId": "uuid",
  "status": "PROCESSING",
  "downloadUrl": "/api/jobs/{jobId}/download",
  "originalSizeBytes": 12345,
  "processedSizeBytes": 6789,
  "error": null
}
```

#### GET /api/jobs/{jobId}/download

Description:
- Download completed output artifact.

Behavior:
- Returns file stream with `Content-Disposition: attachment`.
- Returns not-found style response if job is not completed or missing.

## Error Model

Common `errorCode` values:
- `VALIDATION`
- `NOT_FOUND`
- `RATE_LIMIT`
- `DATABASE_UNAVAILABLE`
- `WORKER_UNAVAILABLE`
- `PROCESSING_ERROR`
- `STORAGE_ERROR`
- `INTERNAL`

Memory mode caveat:
- With `JOB_STORE_MODE=memory`, database errors should not block job metadata writes.
- You may still see Mongo connection warnings in backend logs because Mongo auto-configuration classes are present, but job APIs continue to run using in-memory store.

HTTP guidance:
- `400` bad request / validation
- `404` missing job/artifact
- `429` rate limit
- `500` unexpected failure

## Frontend Contract Notes

Frontend submits:
- `files`
- `toolSlug` (for convert endpoint)
- `configuration` JSON string

Frontend polls:
- `GET /api/jobs/{jobId}` every ~1-2 seconds until terminal state.

Terminal states:
- `COMPLETED` -> show download card.
- `FAILED` -> show error state.

## Security Notes for API Consumers

- Do not log raw passwords from form fields.
- Do not expose worker endpoint publicly.
- Always validate extension and size before heavy processing.
- Treat `downloadUrl` as authorized artifact endpoint in future auth phase.
