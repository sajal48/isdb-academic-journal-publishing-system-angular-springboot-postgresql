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
@Table(name = "journals")
public class Journal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long journalId;

    private String title;
    private String scope;
    private String submissionGuidelines;
    private String editorialBoard;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // Getters and setters
}
