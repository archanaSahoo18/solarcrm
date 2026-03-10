package com.crm.service;

import com.crm.entity.Customer;
import com.crm.entity.Installation;
import com.crm.enums.Stage;
import com.crm.repository.CustomerRepository;
import com.crm.repository.InstallationRepository;
import org.springframework.stereotype.Service;

@Service
public class InstallationService {

    private final InstallationRepository installationRepository;
    private final CustomerRepository customerRepository;
    
    

    public InstallationService(InstallationRepository installationRepository, CustomerRepository customerRepository) {
		this.installationRepository = installationRepository;
		this.customerRepository = customerRepository;
	}



	public Installation saveInstallation(Long customerId,
                                         Installation installationData) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow();

        // VALIDATION → must be FINANCE stage
        if (customer.getStage() != Stage.FINANCE) {
            throw new RuntimeException("Finance must be completed before installation.");
        }

        installationData.setCustomer(customer);

        // AUTO MOVE STAGE → INSTALLATION
        customer.setStage(Stage.INSTALLATION);
        customerRepository.save(customer);

        return installationRepository.save(installationData);
    }
}