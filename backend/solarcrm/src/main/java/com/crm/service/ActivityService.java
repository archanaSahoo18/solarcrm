package com.crm.service;

import com.crm.entity.Activity;
import com.crm.entity.Customer;
import com.crm.repository.ActivityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ActivityService {

    private final ActivityRepository repository;

    public ActivityService(ActivityRepository repository) {
        this.repository = repository;
    }

    public void logActivity(Customer customer,
                            String action,
                            String description,
                            String username) {

        Activity activity = new Activity();
        activity.setCustomer(customer);
        activity.setAction(action);
        activity.setDescription(description);
        activity.setPerformedBy(username);
        activity.setTimestamp(LocalDateTime.now());

        repository.save(activity);
    }
}