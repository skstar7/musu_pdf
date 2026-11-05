package com.pdfplatform.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import com.pdfplatform.model.JobDocument;

public interface JobStore {

    JobDocument save(JobDocument job);

    Optional<JobDocument> findById(String id);

    List<JobDocument> findByExpiresAtBefore(Instant cutoff);

    void deleteById(String id);
}
