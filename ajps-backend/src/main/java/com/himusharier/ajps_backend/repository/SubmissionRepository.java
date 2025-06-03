package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.Profile;
import com.himusharier.ajps_backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    Optional<Submission> findByIdAndProfile(Long submissionId, Profile profile);
}