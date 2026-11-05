package com.pdfplatform.controller;

import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pdfplatform.dto.ApiResponse;
import com.pdfplatform.dto.JobStatusResponse;
import com.pdfplatform.service.PdfJobService;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final PdfJobService pdfJobService;

    public JobController(PdfJobService pdfJobService) {
        this.pdfJobService = pdfJobService;
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<ApiResponse<JobStatusResponse>> getJobStatus(@PathVariable String jobId) {
        JobStatusResponse status = pdfJobService.getJobStatus(jobId);
        return ResponseEntity.ok(ApiResponse.success("Job status fetched", status));
    }

    @GetMapping("/{jobId}/download")
    public ResponseEntity<Resource> download(@PathVariable String jobId) {
        Path filePath = pdfJobService.getDownloadPath(jobId);
        Resource resource = new FileSystemResource(filePath);

        String contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        try {
            String probe = Files.probeContentType(filePath);
            if (probe != null) {
                contentType = probe;
            }
        } catch (Exception ignored) {
        }

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName() + "\"")
            .contentType(MediaType.parseMediaType(contentType))
            .body(resource);
    }
}
