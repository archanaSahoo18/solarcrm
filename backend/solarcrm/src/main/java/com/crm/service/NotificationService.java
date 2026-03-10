package com.crm.service;

import com.crm.entity.Notification;
import com.crm.entity.User;
import com.crm.repository.NotificationRepository;


import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    
    

    public NotificationService(NotificationRepository notificationRepository) {
		this.notificationRepository = notificationRepository;
	}



	public void createNotification(User user, String title, String message) {

        Notification n = new Notification();
        n.setUser(user);
        n.setTitle(title);
        n.setMessage(message);
        n.setIsRead(false);

        notificationRepository.save(n);
    }
}