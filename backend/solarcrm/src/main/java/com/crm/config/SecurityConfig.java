package com.crm.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.crm.utilities.JwtFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // Public
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("OPTIONS", "/**").permitAll()

                // Admin
                .requestMatchers("/api/auth/register").hasRole("ADMIN")

                // CRM Modules
                .requestMatchers("/api/customers/**").hasAnyRole("ADMIN","USER")
                .requestMatchers("/api/documents/**").hasAnyRole("ADMIN","USER")
                .requestMatchers("/api/contracts/**").hasAnyRole("ADMIN","USER")
                .requestMatchers("/api/finance/**").hasAnyRole("ADMIN","USER")
                .requestMatchers("/api/installation/**").hasAnyRole("ADMIN","USER")
                .requestMatchers("/api/followups/**").hasAnyRole("ADMIN","USER")
                .requestMatchers("/api/notifications/**").hasAnyRole("ADMIN","USER")

                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        configuration.setAllowedOrigins(origins);

        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}