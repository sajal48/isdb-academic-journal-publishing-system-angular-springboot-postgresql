package com.himusharier.ajps_backend.config;

import com.himusharier.ajps_backend.exception.JwtUserAuthenticationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtTokenProvider jwtTokenProvider) throws JwtUserAuthenticationException {
        try {
            http
                    .cors(Customizer.withDefaults())
                    .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for REST APIs, (Method Reference)
                    .authorizeHttpRequests(auth -> auth
                            // This path is configured to permit all requests,
                            // allowing unauthenticated users to access authentication endpoints (e.g., /api/auth/login, /api/auth/register).
                            // The actual authentication logic (e.g., validating credentials, generating JWT)
                            // will be implemented in your controller for these paths.
                            .requestMatchers("/api/auth/**").permitAll()
                            .requestMatchers("/ajps-uploads/**").permitAll()
                            .requestMatchers("/api/journal/**").permitAll()
                            .requestMatchers("/api/user/**").hasAnyRole("USER", "EDITOR", "REVIEWER", "ADMIN")
                            .requestMatchers("/api/submission/**").hasAnyRole("USER", "EDITOR", "REVIEWER", "ADMIN")
                            //                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                            .anyRequest().authenticated() // All other requests require authentication
                    )
                    .addFilterBefore(jwtAuthenticationFilter,
                            UsernamePasswordAuthenticationFilter.class)
                    .httpBasic(Customizer.withDefaults())
                    .sessionManagement(session ->
                            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

            return http.build();

        } catch (Exception e) {
            throw new JwtUserAuthenticationException("Invalid unauthenticated request.");
        }
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of("http://localhost:4500")); // Angular origin
        configuration.setAllowedOriginPatterns(List.of("*")); // Angular origin
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // allow Authorization cookie/header etc.

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}
