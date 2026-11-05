package com.pdfplatform.storage;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pdfplatform.config.AppProperties;
import com.pdfplatform.exception.ApiException;

@Service
public class FileStorageService {

    private final AppProperties appProperties;

    public FileStorageService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public StoredUpload storeUploads(List<MultipartFile> files, String jobId) {
        if (files == null || files.isEmpty()) {
            throw new ApiException("At least one file is required", "VALIDATION");
        }

        List<String> storedPaths = new ArrayList<>();
        long totalBytes = 0L;

        Path inputDir = rootPath().resolve("jobs").resolve(jobId).resolve("input");
        createDir(inputDir);

        for (MultipartFile file : files) {
            validate(file);
            String ext = extension(file.getOriginalFilename());
            String safeName = UUID.randomUUID() + (ext.isBlank() ? "" : "." + ext);
            Path destination = inputDir.resolve(safeName).normalize();
            if (!destination.startsWith(inputDir)) {
                throw new ApiException("Invalid file path", "VALIDATION");
            }

            try (InputStream stream = file.getInputStream()) {
                Files.copy(stream, destination, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException ex) {
                throw new ApiException("Unable to store uploaded file", "STORAGE_ERROR");
            }

            storedPaths.add(destination.toAbsolutePath().toString());
            totalBytes += file.getSize();
        }

        return new StoredUpload(storedPaths, totalBytes);
    }

    public Path prepareOutputFile(String jobId, String extension) {
        Path outputDir = rootPath().resolve("jobs").resolve(jobId).resolve("output");
        createDir(outputDir);

        String ext = extension == null || extension.isBlank() ? "pdf" : extension;
        Path output = outputDir.resolve("result-" + Instant.now().toEpochMilli() + "." + ext).normalize();
        if (!output.startsWith(outputDir)) {
            throw new ApiException("Invalid output path", "VALIDATION");
        }
        return output;
    }

    public void deletePathIfExists(Path path) {
        if (path == null) {
            return;
        }
        try {
            if (Files.isDirectory(path)) {
                Files.walk(path)
                    .sorted((a, b) -> b.getNameCount() - a.getNameCount())
                    .forEach(this::silentDelete);
            } else {
                silentDelete(path);
            }
        } catch (IOException ignored) {
        }
    }

    private void silentDelete(Path path) {
        try {
            Files.deleteIfExists(path);
        } catch (IOException ignored) {
        }
    }

    private void validate(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ApiException("Empty file upload is not allowed", "VALIDATION");
        }

        String ext = extension(file.getOriginalFilename());
        List<String> allowed = appProperties.getSecurity().getAllowedExtensions();
        if (!allowed.contains(ext)) {
            throw new ApiException("Unsupported file type", "VALIDATION");
        }
    }

    private String extension(String originalFilename) {
        if (originalFilename == null) {
            return "";
        }
        String sanitized = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        int index = sanitized.lastIndexOf('.');
        if (index < 0 || index == sanitized.length() - 1) {
            return "";
        }
        return sanitized.substring(index + 1).toLowerCase(Locale.ROOT);
    }

    public Path rootPath() {
        return Path.of(appProperties.getStorage().getRoot()).toAbsolutePath().normalize();
    }

    private void createDir(Path path) {
        try {
            Files.createDirectories(path);
        } catch (IOException ex) {
            throw new ApiException("Unable to create storage directories", "STORAGE_ERROR");
        }
    }
}
