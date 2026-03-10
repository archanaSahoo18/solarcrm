package com.crm.repository;

import com.crm.entity.FollowUp;
import com.crm.enums.FollowUpStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {

    List<FollowUp> findByAssignedUserIdAndStatusAndFollowUpDateBetween(
            Long userId,
            FollowUpStatus status,
            LocalDateTime start,
            LocalDateTime end
    );

    List<FollowUp> findByAssignedUserIdAndStatusAndFollowUpDateBefore(
            Long userId,
            FollowUpStatus status,
            LocalDateTime now
    );

    List<FollowUp> findByReminderEnabledTrueAndReminderSentFalseAndStatusAndFollowUpDateBetween(
            FollowUpStatus status,
            LocalDateTime start,
            LocalDateTime end
    );

    Long countByStatusAndFollowUpDateBefore(
            FollowUpStatus status,
            LocalDateTime time
    );
}