package com.pdfplatform.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "jobs")
public class JobDocument {

    @Id
    private String id;

    private String operation;
    private JobStatus status;
    private String message;
    private List<String> inputFilePaths = new ArrayList<>();
    private String outputFilePath;
    private long originalSizeBytes;
    private long processedSizeBytes;
    @Indexed
    private Instant createdAt;
    @Indexed
    private Instant updatedAt;
    @Indexed
    private Instant expiresAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getInputFilePaths() {
        return inputFilePaths;
    }

    public void setInputFilePaths(List<String> inputFilePaths) {
        this.inputFilePaths = inputFilePaths;
    }

    public String getOutputFilePath() {
        return outputFilePath;
    }

    public void setOutputFilePath(String outputFilePath) {
        this.outputFilePath = outputFilePath;
    }

    public long getOriginalSizeBytes() {
        return originalSizeBytes;
    }

    public void setOriginalSizeBytes(long originalSizeBytes) {
        this.originalSizeBytes = originalSizeBytes;
    }

    public long getProcessedSizeBytes() {
        return processedSizeBytes;
    }

    public void setProcessedSizeBytes(long processedSizeBytes) {
        this.processedSizeBytes = processedSizeBytes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}
