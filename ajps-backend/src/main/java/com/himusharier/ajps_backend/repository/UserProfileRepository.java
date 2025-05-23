package com.himusharier.ajps_backend.repository;

import com.himusharier.ajps_backend.model.Auth;
import com.himusharier.ajps_backend.model.UserProfile;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    Optional<UserProfile> findByAuth_Id(Long authId);

}
