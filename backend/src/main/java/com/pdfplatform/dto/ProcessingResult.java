package com.pdfplatform.dto;

public class ProcessingResult {

    private final String outputFilePath;
    private final long processedSizeBytes;

    public ProcessingResult(String outputFilePath, long processedSizeBytes) {
        this.outputFilePath = outputFilePath;
        this.processedSizeBytes = processedSizeBytes;
    }

    public String getOutputFilePath() {
        return outputFilePath;
    }

    public long getProcessedSizeBytes() {
        return processedSizeBytes;
    }
}
