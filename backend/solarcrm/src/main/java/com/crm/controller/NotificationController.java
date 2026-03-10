package com.crm.controller;

import com.crm.entity.Notification;
import com.crm.repository.NotificationRepository;
import com.crm.entity.User;
import com.crm.repository.UserRepository;


import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")

public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository) {
		this.notificationRepository = notificationRepository;
		this.userRepository = userRepository;
	}

	@GetMapping
    public List<Notification> getMyNotifications(Authentication auth) {

        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @GetMapping("/unread-count")
    public long unreadCount(Authentication auth) {

        String username = auth.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @PutMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {

        Notification n = notificationRepository.findById(id).orElseThrow();
        n.setIsRead(true);

        notificationRepository.save(n);
    }
}