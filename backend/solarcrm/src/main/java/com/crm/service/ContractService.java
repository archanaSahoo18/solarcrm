package com.crm.service;

import com.crm.entity.Contract;
import com.crm.entity.Customer;
import com.crm.entity.Installation;
import com.crm.enums.InstallationStatus;
import com.crm.enums.Stage;
import com.crm.repository.ContractRepository;
import com.crm.repository.CustomerRepository;
import com.crm.repository.InstallationRepository;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service

public class ContractService {

    private final ContractRepository contractRepository;
    private final CustomerRepository customerRepository;
    private final InstallationRepository installationRepository;
    private final FileService fileService;
    



	public ContractService(ContractRepository contractRepository, CustomerRepository customerRepository,
			InstallationRepository installationRepository, FileService fileService) {
		this.contractRepository = contractRepository;
		this.customerRepository = customerRepository;
		this.installationRepository = installationRepository;
		this.fileService = fileService;
	}

	// Save contract and move stage to CONTRACT
//    public Contract saveContractAndComplete(Long customerId, Contract contract) {
//
//        Customer customer = customerRepository.findById(customerId)
//                .orElseThrow(() -> new RuntimeException("Customer not found"));
//
//        // check if contract already exists
//        if (contractRepository.findByCustomerId(customerId).isPresent()) {
//            throw new RuntimeException("Contract already exists for this customer");
//        }
//
//        if (customer.getStage() != Stage.INSTALLATION) {
//            throw new RuntimeException("Installation must be completed before contract.");
//        }
//
//        contract.setCustomer(customer);
//
//        Contract savedContract = contractRepository.save(contract);
//
//        customer.setStage(Stage.CONTRACT);
//        customerRepository.save(customer);
//
//        return savedContract;
//    }
    
	@Transactional // Ensures all saves or none happen
    public Contract saveContractAndComplete(
            Long customerId,
            String contractNumber,
            Double systemSize,
            Double totalPrice,
            LocalDate signedDate, // Changed to LocalDate
            MultipartFile file
    ) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // 1. Validations first (Cheap operations)
        Installation installation = installationRepository.findByCustomerId(customerId);
        if (installation == null || installation.getStatus() != InstallationStatus.COMPLETED) {
            throw new RuntimeException("Installation must be completed first");
        }

        if (contractRepository.findByCustomerId(customerId).isPresent()) {
            throw new RuntimeException("Contract already exists for this customer");
        }

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Contract file is required");
        }

        // 2. File Storage (Expensive/Side-effect operation)
        String fileName = fileService.saveFile(file);

        // 3. Entity Creation
        Contract contract = new Contract();
        contract.setContractNumber(contractNumber);
        contract.setSystemSize(systemSize);
        contract.setTotalPrice(totalPrice);
        contract.setSignedDate(signedDate);
        contract.setFileUrl(fileName);
        contract.setCustomer(customer);

        Contract saved = contractRepository.save(contract);

        // 4. State Update
        customer.setStage(Stage.CONTRACT);
        customerRepository.save(customer);

        return saved;
    }

    @Transactional
    public Customer completeProject(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        if (customer.getStage() != Stage.CONTRACT) {
            throw new RuntimeException("Contract must be completed first.");
        }

        Contract contract = contractRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (contract.getFileUrl() == null || contract.getFileUrl().isEmpty()) {
            throw new RuntimeException("Upload contract file before completing project");
        }

        customer.setStage(Stage.COMPLETED);
        return customerRepository.save(customer);
    }

    // Move project to COMPLETED
//    public Customer completeProject(Long customerId) {
//
//        Customer customer = customerRepository.findById(customerId)
//                .orElseThrow(() -> new RuntimeException("Customer not found"));
//
//        if (customer.getStage() != Stage.CONTRACT) {
//            throw new RuntimeException("Contract must be completed first.");
//        }
//
//        customer.setStage(Stage.COMPLETED);
//        return customerRepository.save(customer);
//    }

    
//    public Customer completeProject(Long customerId) {
//
//        Customer customer = customerRepository.findById(customerId)
//                .orElseThrow(() -> new RuntimeException("Customer not found"));
//
//        if (customer.getStage() != Stage.CONTRACT) {
//            throw new RuntimeException("Contract must be completed first.");
//        }
//
//        Contract contract = contractRepository.findByCustomerId(customerId)
//                .orElseThrow(() -> new RuntimeException("Contract not found"));
//
//        // ❗ Ensure file exists
//        if (contract.getFileUrl() == null || contract.getFileUrl().isEmpty()) {
//            throw new RuntimeException("Upload contract file before completing project");
//        }
//
//        customer.setStage(Stage.COMPLETED);
//
//        return customerRepository.save(customer);
//    }

    // Get contract by customer
    public Contract getByCustomer(Long customerId) {

        return contractRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
    }

}