package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.Journal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Long> {

    // Existing methods
    boolean existsByIssn(String issn);
    boolean existsByJournalCode(String journalCode);

    // NEW: Fetch journals with their issues in a single query to avoid N+1 problem
    @Query("SELECT DISTINCT j FROM Journal j LEFT JOIN FETCH j.issues")
    List<Journal> findAllWithIssues();

    // OPTIONAL: If you also want to fetch a single journal with issues
    @Query("SELECT j FROM Journal j LEFT JOIN FETCH j.issues WHERE j.id = :id")
    Optional<Journal> findByIdWithIssues(Long id);
}