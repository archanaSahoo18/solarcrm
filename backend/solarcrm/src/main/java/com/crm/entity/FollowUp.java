package com.crm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.crm.enums.FollowUpStatus;

@Entity
public class FollowUp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String notes;

    private LocalDateTime followUpDate;

    @Enumerated(EnumType.STRING)
    private FollowUpStatus status = FollowUpStatus.PENDING;

    private Boolean reminderEnabled = true;
    private Boolean reminderSent = false;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    private LocalDateTime createdAt = LocalDateTime.now();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public LocalDateTime getFollowUpDate() {
		return followUpDate;
	}

	public void setFollowUpDate(LocalDateTime followUpDate) {
		this.followUpDate = followUpDate;
	}

	public FollowUpStatus getStatus() {
		return status;
	}

	public void setStatus(FollowUpStatus status) {
		this.status = status;
	}

	public Boolean getReminderEnabled() {
		return reminderEnabled;
	}

	public void setReminderEnabled(Boolean reminderEnabled) {
		this.reminderEnabled = reminderEnabled;
	}

	public Boolean getReminderSent() {
		return reminderSent;
	}

	public void setReminderSent(Boolean reminderSent) {
		this.reminderSent = reminderSent;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public User getAssignedUser() {
		return assignedUser;
	}

	public void setAssignedUser(User assignedUser) {
		this.assignedUser = assignedUser;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

    // getters and setters
    
    
}