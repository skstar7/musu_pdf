package com.pdfplatform.controller;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.pdfplatform.config.AppProperties;
import com.pdfplatform.dto.ApiResponse;
import com.pdfplatform.dto.JobStatusResponse;
import com.pdfplatform.exception.ApiException;
import com.pdfplatform.service.PdfJobService;

@RestController
@RequestMapping("/api/pdf")
@Validated
public class PdfController {

    private final PdfJobService pdfJobService;
    private final ObjectMapper objectMapper;
    private final AppProperties appProperties;

    public PdfController(PdfJobService pdfJobService, ObjectMapper objectMapper, AppProperties appProperties) {
        this.pdfJobService = pdfJobService;
        this.objectMapper = objectMapper;
        this.appProperties = appProperties;
    }

    @PostMapping(path = "/merge", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<JobStatusResponse>> merge(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "configuration", required = false) String configuration) {
        return submit("merge-pdf", files, configuration);
    }

    @PostMapping(path = "/split", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<JobStatusResponse>> split(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "configuration", required = false) String configuration) {
        return submit("split-pdf", files, configuration);
    }

    @PostMapping(path = "/compress", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<JobStatusResponse>> compress(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "configuration", required = false) String configuration) {
        return submit("compress-pdf", files, configuration);
    }

    @PostMapping(path = "/rotate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<JobStatusResponse>> rotate(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "configuration", required = false) String configuration) {
        return submit("rotate-pdf", files, configuration);
    }

    @PostMapping(path = "/convert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<JobStatusResponse>> convert(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("toolSlug") String toolSlug,
            @RequestParam(value = "configuration", required = false) String configuration) {
        return submit(toolSlug, files, configuration);
    }

    @PostMapping(path = "/organize", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<JobStatusResponse>> organize(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "configuration", required = false) String configuration) {
        return submit("organize-pdf", files, configuration);
    }

    @PostMapping(path = "/watermark", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<JobStatusResponse>> watermark(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "configuration", required = false) String configuration) {
        return submit("add-watermark", files, configuration);
    }

    @PostMapping(path = "/protect", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<JobStatusResponse>> protect(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "configuration", required = false) String configuration) {
        return submit("protect-pdf", files, configuration);
    }

    @PostMapping(path = "/unlock", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<JobStatusResponse>> unlock(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "configuration", required = false) String configuration) {
        return submit("unlock-pdf", files, configuration);
    }

    @PostMapping(path = "/ocr", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<JobStatusResponse>> ocr(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "configuration", required = false) String configuration) {
        return submit("ocr-pdf", files, configuration);
    }

    private ResponseEntity<ApiResponse<JobStatusResponse>> submit(String operation, List<MultipartFile> files,
            String configurationJson) {
        validateUploads(files);
        Map<String, Object> configuration = parseConfiguration(configurationJson);
        JobStatusResponse status = pdfJobService.submitJob(operation, files, configuration);
        return ResponseEntity.accepted().body(ApiResponse.success("Job submitted", status));
    }

    private void validateUploads(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new ApiException("At least one file is required", "VALIDATION");
        }

        int maxFiles = appProperties.getSecurity().getMaxFilesPerJob();
        if (maxFiles > 0 && files.size() > maxFiles) {
            throw new ApiException("Too many files in one request", "PAYLOAD_TOO_LARGE");
        }

        long totalBytes = files.stream().mapToLong(MultipartFile::getSize).sum();
        long maxBytes = appProperties.getSecurity().getMaxTotalUploadBytes();
        if (maxBytes > 0 && totalBytes > maxBytes) {
            throw new ApiException("Total upload size exceeds configured limit", "PAYLOAD_TOO_LARGE");
        }
    }

    private Map<String, Object> parseConfiguration(String configurationJson) {
        if (configurationJson == null || configurationJson.isBlank()) {
            return Map.of();
        }
        try {
            return objectMapper.readValue(configurationJson, new TypeReference<>() {
            });
        } catch (Exception ex) {
            throw new ApiException("Invalid configuration payload", "VALIDATION");
        }
    }
}
