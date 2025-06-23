package com.himusharier.ajps_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ajps_editor")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Editor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false, unique = true)
    private Profile profile;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "editor_journals",
        joinColumns = @JoinColumn(name = "editor_id"),
        inverseJoinColumns = @JoinColumn(name = "journal_id")
    )
    private List<Journal> assignedJournals = new ArrayList<>();
}
