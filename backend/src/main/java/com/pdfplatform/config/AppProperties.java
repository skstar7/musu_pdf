package com.pdfplatform.config;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private final Storage storage = new Storage();
    private final Processing processing = new Processing();
    private final Security security = new Security();

    public Storage getStorage() {
        return storage;
    }

    public Processing getProcessing() {
        return processing;
    }

    public Security getSecurity() {
        return security;
    }

    public static class Storage {
        private String root = "./data/storage";
        private long retentionHours = 24;

        public String getRoot() {
            return root;
        }

        public void setRoot(String root) {
            this.root = root;
        }

        public long getRetentionHours() {
            return retentionHours;
        }

        public void setRetentionHours(long retentionHours) {
            this.retentionHours = retentionHours;
        }

        public Duration retentionDuration() {
            return Duration.ofHours(retentionHours);
        }
    }

    public static class Processing {
        private String workerBaseUrl = "http://localhost:8090";
        private long timeoutSeconds = 300;

        public String getWorkerBaseUrl() {
            return workerBaseUrl;
        }

        public void setWorkerBaseUrl(String workerBaseUrl) {
            this.workerBaseUrl = workerBaseUrl;
        }

        public long getTimeoutSeconds() {
            return timeoutSeconds;
        }

        public void setTimeoutSeconds(long timeoutSeconds) {
            this.timeoutSeconds = timeoutSeconds;
        }
    }

    public static class Security {
        private List<String> allowedExtensions = new ArrayList<>();
        private int rateLimitPerMinute = 120;
        private int maxFilesPerJob = 20;
        private long maxTotalUploadBytes = 157286400L;

        public List<String> getAllowedExtensions() {
            return allowedExtensions;
        }

        public void setAllowedExtensions(List<String> allowedExtensions) {
            this.allowedExtensions = allowedExtensions;
        }

        public int getRateLimitPerMinute() {
            return rateLimitPerMinute;
        }

        public void setRateLimitPerMinute(int rateLimitPerMinute) {
            this.rateLimitPerMinute = rateLimitPerMinute;
        }

        public int getMaxFilesPerJob() {
            return maxFilesPerJob;
        }

        public void setMaxFilesPerJob(int maxFilesPerJob) {
            this.maxFilesPerJob = maxFilesPerJob;
        }

        public long getMaxTotalUploadBytes() {
            return maxTotalUploadBytes;
        }

        public void setMaxTotalUploadBytes(long maxTotalUploadBytes) {
            this.maxTotalUploadBytes = maxTotalUploadBytes;
        }
    }
}
