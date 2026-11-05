# Musu PDF - Black & White PDF Utility Platform

Musu PDF is a modular PDF utility platform inspired by modern SaaS document tools, designed with an original premium monochrome brand language.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, React Dropzone, Lucide icons.
- Backend: Java, Spring Boot, Spring Web, Validation, Security, MongoDB, Redis.
- Processing: Python, FastAPI, PyMuPDF, pypdf, Pillow, Tesseract dependencies.
- Infra: Docker Compose, Nginx reverse proxy.

## Repository Structure

```
frontend/   # React app (Phase 1)
backend/    # Spring Boot API and async job orchestration (Phase 2)
worker/     # Python processing worker (Phase 3 core tools)
nginx/      # Reverse proxy
```

## Handover Documentation

For team-to-team handover and detailed engineering references, read:

- [docs/HANDOVER_GUIDE.md](docs/HANDOVER_GUIDE.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/API_REFERENCE.md](docs/API_REFERENCE.md)
- [docs/openapi.yaml](docs/openapi.yaml)
- [docs/SETUP_MATRIX.md](docs/SETUP_MATRIX.md)
- [docs/TEAM_PLAYBOOK.md](docs/TEAM_PLAYBOOK.md)
- [docs/DEVOPS_RUNBOOK.md](docs/DEVOPS_RUNBOOK.md)
- [docs/PERFORMANCE.md](docs/PERFORMANCE.md)
- [docs/MACBOOK_SETUP.md](docs/MACBOOK_SETUP.md)

## Quickstart Scripts

From project root:

```bash
scripts/start-local-memory.sh
```

Starts:
- Frontend on `http://localhost:5173`
- Backend on `http://localhost:8080` with `JOB_STORE_MODE=memory`

Full mode (expects Mongo + Redis + worker deps):

```bash
scripts/start-local-full.sh
```

Stop helper:

```bash
scripts/stop-local.sh
```

## What Is Implemented

### Phase 1 - Frontend Foundation (Implemented)

- Premium black-and-white responsive homepage.
- Navbar, hero with upload area, popular tools, categories, how-it-works, security, FAQ, footer.
- Dynamic tool routing with reusable tool registry.
- Reusable components:
	- Navbar, Footer
	- ToolCard, ToolGrid
	- FileUploader, UploadedFileList
	- PDFPreview, PageThumbnail
	- ProcessingProgress, DownloadResult, EmptyState, ErrorState
- Tool workflow states:
	- Upload -> Configure -> Process -> Result/Error
- File reordering support for organize-style workflows.

### Phase 2 - Backend Foundation (Implemented)

- Modular package structure (`config`, `controller`, `service`, `repository`, `model`, `dto`, `exception`, `security`, `storage`, `processing`).
- REST endpoints:
	- `POST /api/pdf/merge`
	- `POST /api/pdf/split`
	- `POST /api/pdf/compress`
	- `POST /api/pdf/rotate`
	- `POST /api/pdf/convert`
	- `POST /api/pdf/organize`
	- `POST /api/pdf/watermark`
	- `POST /api/pdf/protect`
	- `POST /api/pdf/unlock`
	- `POST /api/pdf/ocr`
	- `GET /api/jobs/{jobId}`
	- `GET /api/jobs/{jobId}/download`
- Async job lifecycle with job IDs and polling.
- Storage security controls:
	- file extension validation
	- filename sanitization
	- path traversal protection
	- isolated job directories
	- scheduled cleanup based on retention
- Basic per-IP rate limiting filter.
- Global API envelope and exception handling.

### Phase 3 - Core PDF Operations (Implemented)

Python worker supports real processing for:

1. Merge PDF
2. Split PDF (custom ranges)
3. Compress PDF
4. Rotate PDF
5. JPG to PDF
6. PDF to JPG (ZIP output)
7. Organize PDF (custom page order)

Additional operations with baseline support:

- Protect PDF
- Unlock PDF
- Add text watermark

## What Is Not Fully Completed Yet

- Full interactive thumbnail rendering via PDF.js (placeholder metadata preview currently present).
- OCR, office conversions, advanced editing/signing, redact/compare, and AI tools.
- Authentication, dashboard, billing, subscription controls.
- Full production observability (metrics/tracing/alerting).

## Environment Requirements

- Node.js 20+ (for frontend)
- Java 21 (for backend)
- Python 3.11+
- Docker + Docker Compose

## Local Mode Without MongoDB (Demo/Fallback)

If MongoDB is not available locally, you can run backend in in-memory job mode.

- Set environment variable before starting backend:

```bash
export JOB_STORE_MODE=memory
```

In this mode:
- Job metadata is stored in process memory.
- Restarting backend clears all job history/state.
- This mode is for local testing/demo, not production.

## Local Development

### 1) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 2) Worker

```bash
cd worker
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8090
```

### 3) Backend

```bash
cd backend
export JOB_STORE_MODE=mongo # use memory for fallback if MongoDB is unavailable
mvn spring-boot:run
```

### 4) Full Stack with Docker

```bash
docker compose up --build
```

Main entrypoint: `http://localhost`

## Security Notes

- Uploaded files are not publicly exposed.
- Jobs are stored with expiration and removed by scheduled cleanup.
- Password values are never intentionally logged.
- Rate limiting is enabled server-side.

## Testing

- Backend includes tests for storage validation and job-scoped storage behavior.
- Expand test coverage in subsequent phases:
	- API integration tests
	- worker operation regression tests
	- end-to-end frontend/backend/worker tests

## Important Compatibility Note

Spring Boot 3.x requires Java 17+ (Java 21 recommended). If your environment uses Java 8, backend compilation will fail due class-version mismatch.
