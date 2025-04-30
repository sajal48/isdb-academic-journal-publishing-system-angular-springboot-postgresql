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
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;

    @ManyToOne
    @JoinColumn(name = "version_id")
    private ArticleVersion version;

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    private String comments;
    private String recommendation;

    @Column(name = "reviewed_at")
    private Timestamp reviewedAt;

    // Getters and setters
}
