package com.crm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.crm.entity.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {
	
	Optional<Document> findByCustomerId(Long customerId);

}
