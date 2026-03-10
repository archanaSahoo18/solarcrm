package com.crm.controller;

import com.crm.entity.Contract;
import com.crm.entity.Customer;
import com.crm.service.ContractService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contracts")
@CrossOrigin
public class ContractController {

    private final ContractService service;
    
    

    public ContractController(ContractService service) {
		this.service = service;
	}

	@PostMapping("/{customerId}")
    public Contract addContract(
            @PathVariable Long customerId,
            @RequestBody Contract contract) {

        return service.saveContractAndComplete(customerId, contract);
    }

    @GetMapping("/{customerId}")
    public Contract getContract(@PathVariable Long customerId){
        return service.getByCustomer(customerId);
    }
}