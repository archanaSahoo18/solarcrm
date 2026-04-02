package com.crm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crm.entity.InstallationHistory;

public interface InstallationHistoryRepository extends JpaRepository<InstallationHistory, Long> {

    List<InstallationHistory> findByCustomerIdOrderByUpdatedAtAsc(Long customerId);

}
