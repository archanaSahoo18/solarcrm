package com.crm.service;

import com.crm.dto.CustomerResponse;
import com.crm.entity.Customer;
import com.crm.entity.User;
import com.crm.enums.Role;
import com.crm.enums.Stage;
import com.crm.repository.CustomerRepository;
import com.crm.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;
    private final ActivityService activityService;
    private final UserRepository userRepository;
    


	public CustomerService(CustomerRepository repository, ActivityService activityService,
			UserRepository userRepository) {
		this.repository = repository;
		this.activityService = activityService;
		this.userRepository = userRepository;
	}

	public Customer create(Customer request, User owner) {
		
	    if(repository.existsByPhone(request.getPhone())) {
	        throw new RuntimeException("Customer with this phone number already exists");
	    }

	    Customer customer = new Customer();
	    customer.setName(request.getName());
	    customer.setPhone(request.getPhone());
	    customer.setAddress(request.getAddress());
	    customer.setOwner(owner);
	    customer.setStage(Stage.IDENTIFICATION);

	    Customer saved = repository.save(customer);

	    activityService.logActivity(
	            saved,
	            "CUSTOMER_CREATED",
	            "Customer created",
	            owner.getUsername()
	    );

	    return saved;
	}

    public List<Customer> getAll() {
        return repository.findAll();
    }

    public Customer updateStage(Long id, String stage) {

        Customer customer = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Stage newStage = Stage.valueOf(stage);

        if (customer.getStage() != newStage) {

            customer.setStage(newStage);

            activityService.logActivity(
                    customer,
                    "STAGE_CHANGED",
                    "Stage changed to " + newStage,
                    SecurityContextHolder.getContext().getAuthentication().getName()
            );
        }

        return repository.save(customer);
    }
    
    
    
    public Customer getFullDetails(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
    
//    public Page<CustomerResponse> getCustomersForUser(User user, Pageable pageable) {
//
//        Page<Customer> page;
//
//        if (user.getRole() == Role.ADMIN) {
//            page = repository.findAll(pageable);
//        } else {
//            page = repository.findByOwnerId(user.getId(), pageable);
//        }
//
//        return page.map(c -> {
//
//            CustomerResponse res = new CustomerResponse();
//
//            res.setId(c.getId());
//            res.setName(c.getName());
//            res.setPhone(c.getPhone());
//            res.setAddress(c.getAddress());
//            res.setStage(c.getStage());
//            res.setOwnerName(
//                c.getOwner() != null ? c.getOwner().getUsername() : null
//            );
//
//            // IMPORTANT FOR PIPELINE TABLE
//            res.setFinance(c.getFinance());
//            res.setInstallation(c.getInstallation());
//            res.setContract(c.getContract());
//
//            return res;
//        });
//    }
    
    
    public Page<CustomerResponse> getCustomersForUser(User user, Pageable pageable) {

        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
            );

    	
        Page<Customer> page;

        if (user.getRole() == Role.ADMIN) {
            page = repository.findAll(sortedPageable);
        } else {
            page = repository.findByOwnerId(user.getId(), sortedPageable);
        }

        return page.map(c -> {

            CustomerResponse res = new CustomerResponse();

            res.setId(c.getId());
            res.setName(c.getName());
            res.setPhone(c.getPhone());
            res.setAddress(c.getAddress());
            res.setStage(c.getStage());
            res.setCreatedAt(c.getCreatedAt()); // ⭐ ADD THIS

            res.setOwnerName(
                c.getOwner() != null ? c.getOwner().getUsername() : null
            );

            res.setFinance(c.getFinance());
            res.setInstallation(c.getInstallation());
            res.setContract(c.getContract());

            return res;
        });
    }
    
    public Customer assignCustomer(Long customerId, Long userId) {

        Customer customer = repository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        customer.setOwner(user);

        activityService.logActivity(
                customer,
                "LEAD_ASSIGNED",
                "Lead assigned to " + user.getUsername(),
                SecurityContextHolder.getContext().getAuthentication().getName()
        );

        return repository.save(customer);
    }
}