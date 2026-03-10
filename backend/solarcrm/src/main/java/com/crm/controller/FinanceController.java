package com.crm.controller;

import com.crm.dto.LeaderboardDTO;
import com.crm.entity.Finance;
import com.crm.service.FinanceService;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
@CrossOrigin
public class FinanceController {

    private final FinanceService service;
    
    public FinanceController(FinanceService service) {
		this.service = service;
	}



	@PostMapping("/{customerId}")
    public Finance addFinance(@PathVariable Long customerId,
                              @RequestBody Finance finance) {
        return service.saveFinance(customerId, finance);
    }
	
	@GetMapping("/leaderboard")
	public List<LeaderboardDTO> leaderboard() {
	    return service.getLeaderboard();
	}
}