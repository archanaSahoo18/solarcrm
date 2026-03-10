package com.crm.service;

import com.crm.dto.LeaderboardDTO;
import com.crm.entity.Customer;
import com.crm.entity.Finance;
import com.crm.enums.Stage;
import com.crm.repository.CustomerRepository;
import com.crm.repository.FinanceRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class FinanceService {

    private final FinanceRepository financeRepository;
    private final CustomerRepository customerRepository;
    
    
    

    public FinanceService(FinanceRepository financeRepository, CustomerRepository customerRepository) {
		this.financeRepository = financeRepository;
		this.customerRepository = customerRepository;
	}




	public Finance saveFinance(Long customerId, Finance financeData) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow();

        // Attach customer
        financeData.setCustomer(customer);

        // AUTO MOVE STAGE → FINANCE
        customer.setStage(Stage.FINANCE);
        customerRepository.save(customer);

        return financeRepository.save(financeData);
    }
	
	public List<LeaderboardDTO> getLeaderboard() {
	    return financeRepository.getSalesLeaderboard();
	}
	
}