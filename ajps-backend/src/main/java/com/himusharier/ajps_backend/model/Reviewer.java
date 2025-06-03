package com.himusharier.ajps_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "AJPS_REVIEWER")
public class Reviewer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String reviewerName;

    @Column(nullable = false)
    private String email;

    private String institution;

    private String expertiseArea;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    private Submission submission;
}
