# Performance Optimization Notes

## Scope

This document captures performance-focused changes applied to the current codebase and how to extend them.

## Implemented Optimizations

### Frontend

1. Adaptive job polling with cleanup:
- Replaced fixed `setInterval` style polling with adaptive `setTimeout` backoff.
- Ensures timers are cancelled on reset, route switch, and unmount.
- Reduces unnecessary network pressure and prevents timer leaks.

2. Tool-page state reset on route change:
- Clears stale job/config/file state when switching tools.
- Avoids expensive UI re-renders from stale polling loops.

### Backend

1. MongoDB indexes on job timestamps:
- Added indexes for `createdAt`, `updatedAt`, and `expiresAt` in job document.
- Improves cleanup scans and lifecycle-related lookups as job volume grows.

2. Worker HTTP client tuning:
- Uses JDK HTTP client with explicit connect/read timeout controls.
- Uses dedicated request executor threads to reduce blocking behavior under concurrent jobs.

3. HTTP response compression:
- Enabled server compression for API responses.
- Reduces payload size for status polling and metadata endpoints.

4. Auto index creation:
- Enabled Mongo index creation through Spring config.

### Worker

1. Faster PDF merge path:
- Uses `PdfWriter.append(path)` for efficient source ingestion.

2. Compression path improvements:
- Low compression mode skips expensive image recompression.
- Balanced/strong modes deduplicate image xrefs before recompression.
- Optional downscale before JPEG recompression to reduce CPU and output size.

3. PDF-to-JPG tuning:
- Configurable quality and zoom factors.
- Controlled ZIP compression level.

## Recommended Next Optimizations

1. Add Redis-backed job status cache:
- Cache hot status reads and reduce Mongo roundtrips.

2. Move long-running tasks to queue workers:
- Use Redis Streams / RabbitMQ / Kafka style queue for robust scheduling.

3. Add request-size policy per endpoint:
- Different tools should enforce tailored limits.

4. Add worker process pool:
- Scale worker replicas independently from API nodes.

5. Add synthetic benchmarks:
- Benchmark each operation on sample files (small/medium/large) and track p50/p95.

## Suggested Metrics

- Submit endpoint latency p50/p95
- Job completion time by operation type
- Worker CPU and memory per operation
- Mongo query duration for status/cleanup paths
- Error rate by operation and payload size

## Benchmark Procedure (Basic)

1. Use fixed test corpus (same files each run).
2. Run each operation 30+ times.
3. Capture p50/p95/p99 and failure counts.
4. Compare before/after each optimization.
