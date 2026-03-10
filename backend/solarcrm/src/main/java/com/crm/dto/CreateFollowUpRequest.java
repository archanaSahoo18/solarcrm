package com.crm.dto;

import java.time.LocalDateTime;
import com.crm.enums.FollowUpPriority;

public record CreateFollowUpRequest(
        LocalDateTime scheduledAt,
        String note,
        FollowUpPriority priority
) {}
