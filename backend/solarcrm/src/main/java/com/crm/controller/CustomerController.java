package com.crm.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.crm.dto.CustomerResponse;
import com.crm.entity.Activity;
import com.crm.entity.Customer;
import com.crm.entity.User;
import com.crm.repository.ActivityRepository;
import com.crm.repository.UserRepository;
import com.crm.service.CustomerService;
import com.crm.service.ExcelExportService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/customers")
@CrossOrigin
public class CustomerController {
	
	private final CustomerService service;
	private final ActivityRepository activityRepository;
	private final UserRepository userRepository;
	private final ExcelExportService excelExportService;
	




	public CustomerController(CustomerService service, ActivityRepository activityRepository,
			UserRepository userRepository, ExcelExportService excelExportService) {
		this.service = service;
		this.activityRepository = activityRepository;
		this.userRepository = userRepository;
		this.excelExportService = excelExportService;
	}

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	public Customer create(@Valid @RequestBody Customer request,
	                       Authentication authentication) {

		  if (authentication == null) {
		        throw new IllegalStateException("Unauthorized");
		    }
	    String username = authentication.getName();

	    User user = userRepository.findByUsername(username)
	    		.orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

	    return service.create(request, user);
	}
	
	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	public List<Customer> getAll(){
	    return service.getAll();
	}
	
	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	@PutMapping("/{id}/stage")
	public Customer updateStage (@PathVariable Long id, @RequestParam String stage) {
		return service.updateStage(id, stage);
		
	}
	
	@GetMapping("/{id}/details")
	public Customer getCustomerDetails(@PathVariable Long id) {
	    return service.getFullDetails(id);
	}
	 
	@GetMapping("/paged")
	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	public Page<CustomerResponse> getCustomersPaged(
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "10") int size,
	        Authentication authentication) {

	    Pageable pageable = PageRequest.of(page, size);

	    String username = authentication.getName();

	    User user = userRepository.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    return service.getCustomersForUser(user, pageable);
	}
	
	@GetMapping("/{id}/activities")
	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	public List<Activity> getActivities(@PathVariable Long id) {
	    return activityRepository.findByCustomerIdOrderByTimestampDesc(id);
	}
	
	@GetMapping("/export")
	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	public ResponseEntity<byte[]> exportCustomers() throws Exception {

	    byte[] data = excelExportService.exportCustomers();

	    return ResponseEntity.ok()
	    		.header("Content-Disposition","attachment; filename=customers-" + LocalDate.now() + ".xlsx")
	            .header("Content-Type","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	            .body(data);
	}
	
	@PutMapping("/{id}/assign/{userId}")
	@PreAuthorize("hasRole('ADMIN')")
	public Customer assignCustomer(
	        @PathVariable Long id,
	        @PathVariable Long userId) {

	    return service.assignCustomer(id, userId);
	}

}
