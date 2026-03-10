package com.crm.config;

import com.crm.entity.User;
import com.crm.enums.Role;
import com.crm.repository.UserRepository;


import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}



	@Bean
    CommandLineRunner initAdminUser() {
        return args -> {

            String adminUsername = "admin";

            if (userRepository.findByUsername(adminUsername).isEmpty()) {

                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);

                System.out.println("✅ Default admin user created");
            }
        };
    }
}
