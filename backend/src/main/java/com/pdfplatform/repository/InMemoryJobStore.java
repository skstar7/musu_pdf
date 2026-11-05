package com.pdfplatform.repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.pdfplatform.model.JobDocument;

@Component
@ConditionalOnProperty(name = "app.job-store.mode", havingValue = "memory")
public class InMemoryJobStore implements JobStore {

    private final ConcurrentHashMap<String, JobDocument> jobs = new ConcurrentHashMap<>();

    @Override
    public JobDocument save(JobDocument job) {
        jobs.put(job.getId(), job);
        return job;
    }

    @Override
    public Optional<JobDocument> findById(String id) {
        return Optional.ofNullable(jobs.get(id));
    }

    @Override
    public List<JobDocument> findByExpiresAtBefore(Instant cutoff) {
        List<JobDocument> expired = new ArrayList<>();
        for (JobDocument job : jobs.values()) {
            if (job.getExpiresAt() != null && job.getExpiresAt().isBefore(cutoff)) {
                expired.add(job);
            }
        }
        return expired;
    }

    @Override
    public void deleteById(String id) {
        jobs.remove(id);
    }
}
