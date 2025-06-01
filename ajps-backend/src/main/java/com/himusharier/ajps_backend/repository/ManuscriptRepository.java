package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.Manuscript;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ManuscriptRepository extends JpaRepository<Manuscript, Long> {

}