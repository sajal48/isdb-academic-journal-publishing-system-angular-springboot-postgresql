package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.Reviewer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewerRepository extends JpaRepository<Reviewer, Long> {
    List<Reviewer> findBySubmissionId(Long submissionId);
    void deleteByIdAndSubmissionId(Long reviewerId, Long submissionId);
}
