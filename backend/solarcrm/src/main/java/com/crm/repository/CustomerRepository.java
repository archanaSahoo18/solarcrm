package com.crm.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.crm.entity.Customer;
import com.crm.enums.Stage;


public interface CustomerRepository extends JpaRepository<Customer, Long> {
	
	long countByStage(Stage stage);
	long count();
	
	Optional<Customer> findWithDetailsById(Long id);
	Page<Customer> findByOwnerId(Long ownerId, Pageable pageable);
	boolean existsByPhone(String phone);

}
