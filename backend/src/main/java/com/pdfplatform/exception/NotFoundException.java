package com.pdfplatform.exception;

public class NotFoundException extends ApiException {

    public NotFoundException(String message) {
        super(message, "NOT_FOUND");
    }
}
