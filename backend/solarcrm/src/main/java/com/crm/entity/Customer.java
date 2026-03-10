package com.crm.entity;

import com.crm.enums.Gender;
import com.crm.enums.LeadSource;
import com.crm.enums.LeadSource;
import com.crm.enums.Stage;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
    @Column(unique = true, length = 15)
    private String phone;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;

    
    private String address;

    @Enumerated(EnumType.STRING)
    private Stage stage;

    private LocalDateTime createdAt;
    
    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Document document;
    
    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Finance finance;
    
    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Installation installation;
    
    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Contract contract;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "owner_user_id", nullable = false)
    private User owner;
    
    @Enumerated(EnumType.STRING)
    private LeadSource leadSource;
    
    
    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Stage getStage() {
		return stage;
	}

	public void setStage(Stage stage) {
		this.stage = stage;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}



	@PrePersist
    public void prePersist() {
        this.stage = Stage.IDENTIFICATION;
        this.createdAt = LocalDateTime.now();
    }

	public Document getDocument() {
		return document;
	}

	public void setDocument(Document document) {
		this.document = document;
	}

	public Finance getFinance() {
		return finance;
	}

	public void setFinance(Finance finance) {
		this.finance = finance;
	}

	public Installation getInstallation() {
		return installation;
	}

	public void setInstallation(Installation installation) {
		this.installation = installation;
	}

	public Contract getContract() {
		return contract;
	}

	public void setContract(Contract contract) {
		this.contract = contract;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public LeadSource getLeadSource() {
		return leadSource;
	}

	public void setLeadSource(LeadSource leadSource) {
		this.leadSource = leadSource;
	}


	
	
	
	
}
