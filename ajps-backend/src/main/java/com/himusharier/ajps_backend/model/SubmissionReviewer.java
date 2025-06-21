package com.himusharier.ajps_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "AJPS_SUBMISSION_REVIEWER")
public class SubmissionReviewer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String institution;

    @ManyToOne
    @JoinColumn(name = "submission_id", nullable = false)
    @JsonBackReference
    private Submission submission;


//    public Reviewer() {}

    public SubmissionReviewer(String name, String email, String institution, Submission submission) {
        this.name = name;
        this.email = email;
        this.institution = institution;
        this.submission = submission;
    }

}
