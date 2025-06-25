package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.Paper;
import com.himusharier.ajps_backend.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaperRepository extends JpaRepository<Paper, Long> {

    Optional<Paper> findBySubmission(Submission submission);

}