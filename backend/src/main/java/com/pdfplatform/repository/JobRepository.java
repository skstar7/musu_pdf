package com.pdfplatform.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.pdfplatform.model.JobDocument;

public interface JobRepository extends MongoRepository<JobDocument, String> {
    List<JobDocument> findByExpiresAtBefore(Instant cutoff);
}
