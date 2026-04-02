package com.crm.controller;

import com.crm.entity.Contract;
import com.crm.entity.Customer;
import com.crm.service.ContractService;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/contracts")
@CrossOrigin
public class ContractController {

    private final ContractService service;
    
    

    public ContractController(ContractService service) {
		this.service = service;
	}

//	@PostMapping("/{customerId}")
//    public Contract addContract(
//            @PathVariable Long customerId,
//            @RequestBody Contract contract) {
//
//        return service.saveContractAndComplete(customerId, contract);
//    }
    
    @PostMapping("/{customerId}")
    public Contract addContract(
            @PathVariable Long customerId,
            @RequestParam String contractNumber,
            @RequestParam Double systemSize,
            @RequestParam Double totalPrice,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate signedDate, 
            @RequestParam MultipartFile file
    ) {
        return service.saveContractAndComplete(
                customerId,
                contractNumber,
                systemSize,
                totalPrice,
                signedDate, // Pass as LocalDate
                file
        );
    }

    @GetMapping("/{customerId}")
    public Contract getContract(@PathVariable Long customerId){
        return service.getByCustomer(customerId);
    }
    
    // COMPLETE PROJECT
    @PutMapping("/{customerId}/complete")
    public Customer completeProject(@PathVariable Long customerId){
        return service.completeProject(customerId);
    }
}