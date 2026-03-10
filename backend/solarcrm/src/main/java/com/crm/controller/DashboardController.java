package com.crm.controller;

import com.crm.dto.DashboardResponse;
import com.crm.entity.User;
import com.crm.repository.UserRepository;
import com.crm.service.DashboardService;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    private final DashboardService service;
    private final UserRepository userRepository;
    

  

    public DashboardController(DashboardService service, UserRepository userRepository) {
		this.service = service;
		this.userRepository = userRepository;
	}




	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	@GetMapping
    public DashboardResponse getDashboard(Authentication authentication) {
    	
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return service.getDashboardData(user.getId(), user.getRole());
    }
	
	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	@GetMapping("/finance/monthly-revenue")
	public Map<Integer, Double> getMonthlyRevenue(){
	    return service.getMonthlyRevenue();
	}
}