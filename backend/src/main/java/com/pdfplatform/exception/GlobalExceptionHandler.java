package com.pdfplatform.exception;

import com.mongodb.MongoTimeoutException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataAccessException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.pdfplatform.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException ex) {
        HttpStatus status;
        if ("NOT_FOUND".equals(ex.getErrorCode())) {
            status = HttpStatus.NOT_FOUND;
        } else if ("VALIDATION".equals(ex.getErrorCode())) {
            status = HttpStatus.BAD_REQUEST;
        } else if ("PAYLOAD_TOO_LARGE".equals(ex.getErrorCode())) {
            status = HttpStatus.PAYLOAD_TOO_LARGE;
        } else if ("RATE_LIMIT".equals(ex.getErrorCode())) {
            status = HttpStatus.TOO_MANY_REQUESTS;
        } else {
            status = HttpStatus.BAD_REQUEST;
        }

        return ResponseEntity.status(status).body(ApiResponse.error(ex.getMessage(), ex.getErrorCode()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error("Validation failed", "VALIDATION"));
    }

    @ExceptionHandler({DataAccessException.class, MongoTimeoutException.class})
    public ResponseEntity<ApiResponse<Void>> handleDatabaseUnavailable(Exception ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(ApiResponse.error("Database unavailable. Please start MongoDB and retry.", "DATABASE_UNAVAILABLE"));
    }

    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<ApiResponse<Void>> handleWorkerUnavailable(ResourceAccessException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
            .body(ApiResponse.error("Processing worker is unavailable. Please start worker service and retry.", "WORKER_UNAVAILABLE"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleUnknown(Exception ex) {
        return ResponseEntity.internalServerError().body(ApiResponse.error("Unexpected server error", "INTERNAL"));
    }
}
