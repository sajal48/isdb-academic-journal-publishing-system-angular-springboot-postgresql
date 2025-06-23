package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.Journal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JournalRepository extends JpaRepository<Journal, Long> {
    boolean existsByIssn(String issn);
    boolean existsByJournalCode(String journalCode);
}
