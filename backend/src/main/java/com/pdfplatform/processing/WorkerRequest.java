package com.pdfplatform.processing;

import java.util.List;
import java.util.Map;

public class WorkerRequest {

    private String operation;
    private List<String> inputFiles;
    private String outputFile;
    private Map<String, Object> configuration;

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public List<String> getInputFiles() {
        return inputFiles;
    }

    public void setInputFiles(List<String> inputFiles) {
        this.inputFiles = inputFiles;
    }

    public String getOutputFile() {
        return outputFile;
    }

    public void setOutputFile(String outputFile) {
        this.outputFile = outputFile;
    }

    public Map<String, Object> getConfiguration() {
        return configuration;
    }

    public void setConfiguration(Map<String, Object> configuration) {
        this.configuration = configuration;
    }
}
