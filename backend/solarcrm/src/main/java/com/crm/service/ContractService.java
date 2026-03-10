package com.crm.service;

import com.crm.entity.Contract;
import com.crm.entity.Customer;
import com.crm.enums.Stage;
import com.crm.repository.ContractRepository;
import com.crm.repository.CustomerRepository;
import org.springframework.stereotype.Service;

@Service

public class ContractService {

    private final ContractRepository contractRepository;
    private final CustomerRepository customerRepository;
    
    

    public ContractService(ContractRepository contractRepository, CustomerRepository customerRepository) {
		this.contractRepository = contractRepository;
		this.customerRepository = customerRepository;
	}


	// Save contract and move stage to CONTRACT
    public Contract saveContractAndComplete(Long customerId, Contract contract) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // check if contract already exists
        if (contractRepository.findByCustomerId(customerId).isPresent()) {
            throw new RuntimeException("Contract already exists for this customer");
        }

        if (customer.getStage() != Stage.INSTALLATION) {
            throw new RuntimeException("Installation must be completed before contract.");
        }

        contract.setCustomer(customer);

        Contract savedContract = contractRepository.save(contract);

        customer.setStage(Stage.CONTRACT);
        customerRepository.save(customer);

        return savedContract;
    }


    // Move project to COMPLETED
    public Customer completeProject(Long customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (customer.getStage() != Stage.CONTRACT) {
            throw new RuntimeException("Contract must be completed first.");
        }

        customer.setStage(Stage.COMPLETED);
        return customerRepository.save(customer);
    }


    // Get contract by customer
    public Contract getByCustomer(Long customerId) {

        return contractRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
    }

}