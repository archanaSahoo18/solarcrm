package com.crm.controller;

import com.crm.entity.User;
import com.crm.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ Admin can view all users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Admin can delete user
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "User deleted successfully";
    }
}