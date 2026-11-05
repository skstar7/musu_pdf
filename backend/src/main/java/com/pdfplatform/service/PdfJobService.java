package com.pdfplatform.service;

import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pdfplatform.config.AppProperties;
import com.pdfplatform.dto.JobStatusResponse;
import com.pdfplatform.dto.ProcessingResult;
import com.pdfplatform.exception.NotFoundException;
import com.pdfplatform.model.JobDocument;
import com.pdfplatform.model.JobStatus;
import com.pdfplatform.processing.PdfProcessingClient;
import com.pdfplatform.repository.JobStore;
import com.pdfplatform.storage.FileStorageService;
import com.pdfplatform.storage.StoredUpload;

@Service
public class PdfJobService {

    private final JobStore jobStore;
    private final FileStorageService fileStorageService;
    private final PdfProcessingClient processingClient;
    private final AppProperties appProperties;

    public PdfJobService(JobStore jobStore, FileStorageService fileStorageService,
            PdfProcessingClient processingClient, AppProperties appProperties) {
        this.jobStore = jobStore;
        this.fileStorageService = fileStorageService;
        this.processingClient = processingClient;
        this.appProperties = appProperties;
    }

    public JobStatusResponse submitJob(String operation, List<MultipartFile> files, Map<String, Object> configuration) {
        String jobId = UUID.randomUUID().toString();
        StoredUpload upload = fileStorageService.storeUploads(files, jobId);

        JobDocument job = new JobDocument();
        job.setId(jobId);
        job.setOperation(operation);
        job.setStatus(JobStatus.QUEUED);
        job.setMessage("Queued");
        job.setInputFilePaths(upload.absolutePaths());
        job.setOriginalSizeBytes(upload.totalSizeBytes());

        Instant now = Instant.now();
        job.setCreatedAt(now);
        job.setUpdatedAt(now);
        job.setExpiresAt(now.plus(appProperties.getStorage().retentionDuration()));
        jobStore.save(job);

        String extension = determineOutputExtension(operation, configuration);
        Path outputPath = fileStorageService.prepareOutputFile(jobId, extension);
        processAsync(jobId, operation, upload.absolutePaths(), outputPath.toAbsolutePath().toString(), configuration);

        return new JobStatusResponse(jobId, JobStatus.QUEUED, null, job.getOriginalSizeBytes(), null, null);
    }

    @Async("processingExecutor")
    public void processAsync(String jobId, String operation, List<String> inputFiles, String outputFile,
            Map<String, Object> configuration) {
        JobDocument job = findJob(jobId);
        try {
            job.setStatus(JobStatus.PROCESSING);
            job.setUpdatedAt(Instant.now());
            job.setMessage("Processing");
            jobStore.save(job);

            ProcessingResult result = processingClient.process(operation, inputFiles, outputFile, configuration);

            job.setStatus(JobStatus.COMPLETED);
            job.setOutputFilePath(result.getOutputFilePath());
            job.setProcessedSizeBytes(result.getProcessedSizeBytes());
            job.setUpdatedAt(Instant.now());
            job.setMessage("Completed");
            jobStore.save(job);
        } catch (Exception ex) {
            job.setStatus(JobStatus.FAILED);
            job.setUpdatedAt(Instant.now());
            job.setMessage(ex.getMessage());
            jobStore.save(job);
        }
    }

    public JobStatusResponse getJobStatus(String jobId) {
        JobDocument job = findJob(jobId);

        String downloadUrl = null;
        if (job.getStatus() == JobStatus.COMPLETED && job.getOutputFilePath() != null) {
            downloadUrl = "/api/jobs/" + jobId + "/download";
        }

        return new JobStatusResponse(
            job.getId(),
            job.getStatus(),
            downloadUrl,
            job.getOriginalSizeBytes(),
            job.getProcessedSizeBytes(),
            job.getStatus() == JobStatus.FAILED ? job.getMessage() : null
        );
    }

    public Path getDownloadPath(String jobId) {
        JobDocument job = findJob(jobId);
        if (job.getStatus() != JobStatus.COMPLETED || job.getOutputFilePath() == null) {
            throw new NotFoundException("Processed file is not available");
        }

        Path outputPath = Path.of(job.getOutputFilePath()).toAbsolutePath().normalize();
        Path root = fileStorageService.rootPath();
        if (!outputPath.startsWith(root)) {
            throw new NotFoundException("Download path is invalid");
        }
        return outputPath;
    }

    public void cleanupExpiredJobs() {
        Instant cutoff = Instant.now();
        List<JobDocument> expiredJobs = jobStore.findByExpiresAtBefore(cutoff);

        for (JobDocument job : expiredJobs) {
            Path jobPath = fileStorageService.rootPath().resolve("jobs").resolve(job.getId());
            fileStorageService.deletePathIfExists(jobPath);
            jobStore.deleteById(job.getId());
        }
    }

    private JobDocument findJob(String jobId) {
        return jobStore.findById(jobId)
            .orElseThrow(() -> new NotFoundException("Job not found: " + jobId));
    }

    private String determineOutputExtension(String operation, Map<String, Object> configuration) {
        if (operation.contains("pdf-to-jpg")) {
            return "zip";
        }

        if (operation.contains("pdf-to-word")) {
            return "docx";
        }

        if (operation.contains("pdf-to-excel")) {
            return "xlsx";
        }

        if (operation.contains("pdf-to-powerpoint")) {
            return "pptx";
        }

        Object explicit = configuration.get("outputFormat");
        if (explicit != null) {
            return explicit.toString();
        }

        return "pdf";
    }
}
