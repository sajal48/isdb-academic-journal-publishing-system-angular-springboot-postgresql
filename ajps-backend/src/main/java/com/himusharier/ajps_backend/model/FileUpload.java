package com.himusharier.ajps_backend.model;

import com.himusharier.ajps_backend.constants.FileUploadOrigin;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "AJPS_FILES")
public class FileUpload {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private FileUploadOrigin fileOrigin;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileType;

    @Lob
    @Column(nullable = false)
    private byte[] data;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;
}
