package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.Journal;
import com.himusharier.ajps_backend.model.Reviewer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReviewerRepository extends JpaRepository<Reviewer, Long> {

    @Query("SELECT r FROM Reviewer r " +
           "JOIN FETCH r.profile p " +
           "JOIN FETCH p.auth a " +
           "LEFT JOIN FETCH r.assignedJournals j")
    List<Reviewer> findAllWithProfileAndJournals();

    @Query("SELECT j FROM Journal j WHERE j.id IN :ids")
    List<Journal> findJournalsByIds(List<Long> ids);
}
