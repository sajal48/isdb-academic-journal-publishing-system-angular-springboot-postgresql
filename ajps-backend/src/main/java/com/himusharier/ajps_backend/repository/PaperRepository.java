package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.Paper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaperRepository extends JpaRepository<Paper, Long> {}