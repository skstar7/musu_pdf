package com.pdfplatform.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.pdfplatform.model.JobDocument;

@Component
@ConditionalOnProperty(name = "app.job-store.mode", havingValue = "mongo", matchIfMissing = true)
public class MongoJobStore implements JobStore {

    private final JobRepository jobRepository;

    public MongoJobStore(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Override
    public JobDocument save(JobDocument job) {
        return jobRepository.save(job);
    }

    @Override
    public Optional<JobDocument> findById(String id) {
        return jobRepository.findById(id);
    }

    @Override
    public List<JobDocument> findByExpiresAtBefore(Instant cutoff) {
        return jobRepository.findByExpiresAtBefore(cutoff);
    }

    @Override
    public void deleteById(String id) {
        jobRepository.deleteById(id);
    }
}
