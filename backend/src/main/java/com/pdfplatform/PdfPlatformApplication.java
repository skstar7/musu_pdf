package com.pdfplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PdfPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(PdfPlatformApplication.class, args);
    }
}
