package com.crm;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordTest {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String rawPasswordInput = "admin123";
        String databaseHash = "$2a$10$4NzMZGj0PPqPvyMR48AuLevVRmGi/EP8nxBWppbBJXkgpL9AZUyRu";
        
        // This returns true or false
        boolean isMatch = encoder.matches(rawPasswordInput, databaseHash);
        
        System.out.println("Password match status: " + isMatch);
    }
}