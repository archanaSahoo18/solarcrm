package com.crm.controller;

import com.crm.entity.Customer;
import com.crm.entity.FollowUp;
import com.crm.entity.User;
import com.crm.enums.FollowUpStatus;
import com.crm.repository.CustomerFollowUpRepository;
import com.crm.repository.CustomerRepository;
import com.crm.repository.UserRepository;


import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/followups")
public class FollowUpController {

    private final CustomerFollowUpRepository followUpRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    
    
    

    public FollowUpController(CustomerFollowUpRepository followUpRepository, CustomerRepository customerRepository,
			UserRepository userRepository) {
		this.followUpRepository = followUpRepository;
		this.customerRepository = customerRepository;
		this.userRepository = userRepository;
	}

	// ================= COUNT APIs =================

    @GetMapping("/count/today")
    public Long countToday() {

        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        return followUpRepository.countAllToday(
                FollowUpStatus.SCHEDULED,
                start,
                end
        );
    }

    @GetMapping("/count/overdue")
    public Long countOverdue() {

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        return followUpRepository.countAllOverdue(
                FollowUpStatus.SCHEDULED,
                startOfToday
        );
    }

    // ================= CREATE FOLLOW-UP =================

    @PostMapping("/{customerId}")
    public FollowUp createFollowUp(
            @PathVariable Long customerId,
            @RequestBody FollowUp request,
            Authentication auth) {

        String username = auth.getName();

        User user = userRepository.findByUsername(username).orElseThrow();
        Customer customer = customerRepository.findById(customerId).orElseThrow();

        FollowUp followUp = new FollowUp();
        followUp.setTitle(request.getTitle());
        followUp.setNotes(request.getNotes());
        followUp.setFollowUpDate(request.getFollowUpDate());
        followUp.setReminderEnabled(true);
        followUp.setAssignedUser(user);
        followUp.setCustomer(customer);
        followUp.setStatus(FollowUpStatus.SCHEDULED);

        return followUpRepository.save(followUp);
    }

    // ================= TODAY FOLLOW-UPS =================

    @GetMapping("/today")
    public List<FollowUp> todayFollowUps() {

        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        return followUpRepository.findByFollowUpDateBetween(start, end);
    }

    // ================= OVERDUE FOLLOW-UPS =================

    @GetMapping("/overdue")
    public List<FollowUp> overdueFollowUps() {

        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();

        return followUpRepository.findByFollowUpDateBefore(startOfToday);
    }
    @PutMapping("/{id}/complete")
    public FollowUp markFollowUpDone(@PathVariable Long id) {

        FollowUp followUp = followUpRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Follow-up not found"));

        followUp.setStatus(FollowUpStatus.DONE);

        return followUpRepository.save(followUp);
    }
    
}