package com.crm.repository;

import com.crm.entity.Contract;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ContractRepository extends JpaRepository<Contract, Long> {
	

    Optional<Contract> findByCustomerId(Long customerId);
}