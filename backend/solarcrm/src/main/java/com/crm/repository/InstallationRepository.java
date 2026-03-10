package com.crm.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.crm.entity.Installation;

public interface InstallationRepository extends JpaRepository<Installation, Long> {
	
	@Query("SELECT SUM(i.expense) FROM Installation i")
	Double getTotalInstallationExpense();

}
