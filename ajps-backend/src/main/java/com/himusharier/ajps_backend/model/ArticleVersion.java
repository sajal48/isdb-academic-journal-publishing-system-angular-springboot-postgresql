package com.himusharier.ajps_backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "article_versions")
public class ArticleVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long versionId;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    private String filePath;
    private Integer versionNumber;

    @Column(name = "submitted_at")
    private Timestamp submittedAt;

    private String comments;

    // Getters and setters
}
