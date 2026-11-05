# Setup Matrix

## Why This Exists

Different engineers may use different operating systems and privilege levels.
This matrix provides clear install/run paths and fallback options.

## Required by Role

Frontend engineer:
- Node.js 20+
- npm 10+

Backend engineer:
- Java 21
- Maven 3.9+
- MongoDB
- Redis

Worker engineer:
- Python 3.11 preferred
- pip
- Tesseract OCR
- LibreOffice (for future office conversion phase)
- Native libs required by Pillow/PyMuPDF

DevOps engineer:
- Docker + Compose
- Nginx
- Monitoring stack tools

## Installation Modes

### Mode 1: Recommended (Docker-first)

Use when:
- Need consistent environment quickly.
- Team wants fewer host-level dependency issues.

Pros:
- Fast onboarding.
- Fewer machine-specific failures.

Cons:
- Docker required.

### Mode 2: Native local development

Use when:
- You need debugger-heavy IDE workflows.
- You are iterating quickly on a single service.

Pros:
- Faster service restart loops.
- Better local instrumentation.

Cons:
- Dependency mismatch risk.

### Mode 3: Backend in-memory fallback (no MongoDB)

Use when:
- You need quick local API testing but MongoDB is not available.

How:
- Start backend with `JOB_STORE_MODE=memory`.

Command:

```bash
cd backend
JOB_STORE_MODE=memory mvn spring-boot:run
```

Trade-offs:
- Job data is ephemeral and cleared on restart.
- Not suitable for multi-instance or production use.
- You may still see Mongo connection warnings in logs; in-memory job handling remains active.

## Known Environment Pitfalls

- Java 8 cannot run Spring Boot 3.x.
- Missing `npm` blocks frontend.
- Missing `pip`/native headers can block worker package builds.
- Missing MongoDB/Redis causes backend runtime connection errors.

## Verification Commands

Run from terminal:

```bash
node -v
npm -v
java -version
javac -version
mvn -version
python3 --version
pip3 --version
docker --version
docker compose version
mongod --version
redis-server --version
tesseract --version
libreoffice --version
```

## Service Startup Order

Native mode order:
1. MongoDB
2. Redis
3. Worker
4. Backend
5. Frontend

Compose mode:
- `docker compose up --build`

## Smoke Test Flow

1. Open frontend.
2. Navigate to Merge PDF tool.
3. Upload test files.
4. Submit process.
5. Verify backend job creation.
6. Verify status transitions to `COMPLETED`.
7. Download output.

## Example Test Assets

Prepare a local test pack:
- 2 small PDF files.
- 2 JPG images.
- 1 password-protected PDF for unlock testing.

## Secrets and Config Discipline

- Keep `.env` files local and out of version control.
- Use environment variable templates from `.env.example` files.
- For production, use secret manager instead of plaintext files.
