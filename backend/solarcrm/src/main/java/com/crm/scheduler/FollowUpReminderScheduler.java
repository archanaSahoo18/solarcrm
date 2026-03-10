package com.crm.scheduler;

import com.crm.entity.FollowUp;
import com.crm.enums.FollowUpStatus;
import com.crm.repository.FollowUpRepository;
import com.crm.service.NotificationService;



import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component

public class FollowUpReminderScheduler {

    private final FollowUpRepository followUpRepository;
    private final NotificationService notificationService;
    
   

    public FollowUpReminderScheduler(FollowUpRepository followUpRepository, NotificationService notificationService) {
		this.followUpRepository = followUpRepository;
		this.notificationService = notificationService;
	}




	// runs every 1 minute
    @Scheduled(fixedRate = 60000)
    public void checkFollowUps() {

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime next30Minutes = now.plusMinutes(30);

        List<FollowUp> upcoming = followUpRepository
                .findByReminderEnabledTrueAndReminderSentFalseAndStatusAndFollowUpDateBetween(
                        FollowUpStatus.SCHEDULED,
                        now,
                        next30Minutes
                );

        for (FollowUp followUp : upcoming) {

            notificationService.createNotification(
                    followUp.getAssignedUser(),
                    "Follow-Up Reminder",
                    "Follow-up due for customer: "
                            + followUp.getCustomer().getName()
            );

            followUp.setReminderSent(true);
            followUpRepository.save(followUp);
        }
    }
}