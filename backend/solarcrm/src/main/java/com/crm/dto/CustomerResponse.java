package com.crm.dto;

import com.crm.enums.Stage;

public class CustomerResponse {

    private Long id;
    private String name;
    private String phone;
    private String address;
    private Stage stage;
    private String ownerName;



	public CustomerResponse(Long id, String name, String phone, String address, Stage stage, String ownerName) {
		this.id = id;
		this.name = name;
		this.phone = phone;
		this.address = address;
		this.stage = stage;
		this.ownerName = ownerName;
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

    
    
    
}
