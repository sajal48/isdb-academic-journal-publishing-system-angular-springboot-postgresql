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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(updatable = false, nullable = false, unique = true)
    private Long userId;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    //private Long otp;
    //private boolean isOtpUsed;

    /*@Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthStatus authStatus;*/

    @OneToOne(mappedBy = "auth", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private UserProfile userProfile;


    public Auth(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        //this.role = role;
        this.role = (role != null) ? role : Role.USER; // default value USER if null
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        userId = generateRandomUserId();
        //otp = generateRandomOtp();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private Long generateRandomUserId() {
        return 10_000_000L + new Random().nextLong(90_000_000L); // 8-digit number
    }

    private Long generateRandomOtp() {
        return 100000L + new Random().nextInt(900000); // 6-digit number
    }
}