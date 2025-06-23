package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.SubmissionReviewer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionReviewerRepository extends JpaRepository<SubmissionReviewer, Long> {
    List<SubmissionReviewer> findBySubmissionId(Long submissionId);
    void deleteByIdAndSubmissionId(Long reviewerId, Long submissionId);
}
