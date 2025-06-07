package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.FileUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {

    List<FileUpload> findBySubmissionId(Long submissionId);

    void deleteByIdAndSubmissionId(Long id, Long submissionId);
}
