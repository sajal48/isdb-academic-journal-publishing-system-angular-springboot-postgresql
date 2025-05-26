package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.ManuscriptSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for ManuscriptSubmission entity.
 * Extends JpaRepository to provide standard CRUD operations
 * and powerful query capabilities for ManuscriptSubmission objects.
 */
@Repository
public interface ManuscriptSubmissionRepository extends JpaRepository<ManuscriptSubmission, Long> {
    // Custom query methods can be added here if needed, e.g.:
    // List<ManuscriptSubmission> findByJournal(String journal);
}