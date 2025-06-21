package com.himusharier.ajps_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ajps_reviewer")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reviewer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false, unique = true)
    private Profile profile;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "reviewer_journals",
        joinColumns = @JoinColumn(name = "reviewer_id"),
        inverseJoinColumns = @JoinColumn(name = "journal_id")
    )
    private List<Journal> assignedJournals = new ArrayList<>();
}
