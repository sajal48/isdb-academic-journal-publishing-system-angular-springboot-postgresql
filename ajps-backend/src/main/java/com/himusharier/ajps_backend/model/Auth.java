package com.himusharier.ajps_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.himusharier.ajps_backend.constants.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Random;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "AJPS_AUTH")
public class Auth {
    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false, unique = true)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Auth(
            String email,
            String password
//            Role role
    ) {
        this.email = email;
        this.password = password;
//        this.role = role;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        id = generateRandomId();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private Long generateRandomId() {
        return 10_000_000L + new Random().nextLong(90_000_000L); // 8-digit number
    }
}