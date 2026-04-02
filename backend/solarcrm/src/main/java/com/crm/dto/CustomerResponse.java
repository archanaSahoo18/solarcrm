package com.crm.dto;

import java.time.LocalDateTime;

import com.crm.entity.Contract;
import com.crm.entity.Finance;
import com.crm.entity.Installation;
import com.crm.enums.Stage;

public class CustomerResponse {

    private Long id;
    private String name;
    private String phone;
    private String address;
    private Stage stage;
    private String ownerName;

    
    private Finance finance;
    private Installation installation;
    private Contract contract;
    
    private LocalDateTime createdAt;

    public CustomerResponse() {}



	public CustomerResponse(Long id, String name, String phone, String address, Stage stage, String ownerName,
			Finance finance, Installation installation, Contract contract, LocalDateTime createdAt) {
		this.id = id;
		this.name = name;
		this.phone = phone;
		this.address = address;
		this.stage = stage;
		this.ownerName = ownerName;
		this.finance = finance;
		this.installation = installation;
		this.contract = contract;
		this.createdAt = createdAt;
	}



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

	public String getOwnerName() {
		return ownerName;
	}

	public void setOwnerName(String ownerName) {
		this.ownerName = ownerName;
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



	public LocalDateTime getCreatedAt() {
		return createdAt;
	}



	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

    
    
    
}
