package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.SubmissionReviewer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubmissionReviewerRepository extends JpaRepository<SubmissionReviewer, Long> {
    List<SubmissionReviewer> findBySubmissionId(Long submissionId);
    void deleteByIdAndSubmissionId(Long reviewerId, Long submissionId);
}
