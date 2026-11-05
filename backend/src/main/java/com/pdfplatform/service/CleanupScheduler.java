package com.pdfplatform.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CleanupScheduler {

    private final PdfJobService pdfJobService;

    public CleanupScheduler(PdfJobService pdfJobService) {
        this.pdfJobService = pdfJobService;
    }

    @Scheduled(cron = "0 */15 * * * *")
    public void cleanupExpiredFiles() {
        pdfJobService.cleanupExpiredJobs();
    }
}
