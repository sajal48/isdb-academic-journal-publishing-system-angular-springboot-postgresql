package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByJournalId(Long journalId);
}