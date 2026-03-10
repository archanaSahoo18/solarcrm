package com.crm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;        // STAGE_CHANGED, FINANCE_ADDED, etc.
    private String description;   // Human readable text
    private String performedBy;   // Username

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getPerformedBy() {
		return performedBy;
	}

	public void setPerformedBy(String performedBy) {
		this.performedBy = performedBy;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}
    
    
    

    // getters & setters
}