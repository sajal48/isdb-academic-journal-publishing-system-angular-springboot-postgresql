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
@Table(name = "articles")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long articleId;

    private String title;
    private String abstractText;

    private Integer currentVersionId;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    @ManyToOne
    @JoinColumn(name = "journal_id")
    private Journal journal;

    @ManyToOne
    @JoinColumn(name = "issue_id")
    private Issue issue;

    private String status;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // Getters and setters
}
