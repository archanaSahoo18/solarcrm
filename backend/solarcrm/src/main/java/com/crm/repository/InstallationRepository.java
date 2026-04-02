package com.crm.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.crm.entity.Installation;
import com.crm.entity.InstallationHistory;

public interface InstallationRepository extends JpaRepository<Installation, Long> {
	
	@Query("SELECT SUM(i.expense) FROM Installation i")
	Double getTotalInstallationExpense();
	

    Installation  findByCustomerId(Long customerId);
    

}
