package com.pdfplatform.dto;

import com.pdfplatform.model.JobStatus;

public class JobStatusResponse {

    private final String jobId;
    private final JobStatus status;
    private final String downloadUrl;
    private final Long originalSizeBytes;
    private final Long processedSizeBytes;
    private final String error;

    public JobStatusResponse(String jobId, JobStatus status, String downloadUrl, Long originalSizeBytes, Long processedSizeBytes,
            String error) {
        this.jobId = jobId;
        this.status = status;
        this.downloadUrl = downloadUrl;
        this.originalSizeBytes = originalSizeBytes;
        this.processedSizeBytes = processedSizeBytes;
        this.error = error;
    }

    public String getJobId() {
        return jobId;
    }

    public JobStatus getStatus() {
        return status;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public Long getOriginalSizeBytes() {
        return originalSizeBytes;
    }

    public Long getProcessedSizeBytes() {
        return processedSizeBytes;
    }

    public String getError() {
        return error;
    }
}
