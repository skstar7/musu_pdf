package com.pdfplatform.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import com.pdfplatform.config.AppProperties;
import com.pdfplatform.exception.ApiException;
import com.pdfplatform.storage.FileStorageService;

class FileStorageServiceTest {

    @Test
    void shouldRejectUnsupportedFileExtension() {
        AppProperties properties = new AppProperties();
        properties.getSecurity().setAllowedExtensions(List.of("pdf"));
        properties.getStorage().setRoot("./target/test-storage");

        FileStorageService storageService = new FileStorageService(properties);
        MockMultipartFile file = new MockMultipartFile("files", "virus.exe", "application/octet-stream", "bad".getBytes());

        assertThrows(ApiException.class, () -> storageService.storeUploads(List.of(file), "job-a"));
    }

    @Test
    void shouldStorePdfFileInJobScopedFolder() throws Exception {
        AppProperties properties = new AppProperties();
        Path root = Files.createTempDirectory("pdf-storage-test");
        properties.getStorage().setRoot(root.toString());
        properties.getSecurity().setAllowedExtensions(List.of("pdf"));

        FileStorageService storageService = new FileStorageService(properties);
        MockMultipartFile file = new MockMultipartFile("files", "sample.pdf", "application/pdf", "test".getBytes());

        var upload = storageService.storeUploads(List.of(file), "job-b");

        assertTrue(upload.totalSizeBytes() > 0);
        assertTrue(upload.absolutePaths().size() == 1);
        assertTrue(upload.absolutePaths().get(0).contains("job-b"));
    }
}
