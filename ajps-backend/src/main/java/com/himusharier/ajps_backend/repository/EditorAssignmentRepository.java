package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.EditorAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EditorAssignmentRepository extends JpaRepository<EditorAssignment, Long> {
    void deleteByProfileIdAndJournalId(Long profileId, Long journalId);
    List<EditorAssignment> findByProfileId(Long profileId);

    List<EditorAssignment> findByJournalId(Long journalId); // Add this new method
}