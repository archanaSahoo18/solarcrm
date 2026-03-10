package com.crm.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String aadharFile;
    private String panCardFile;
    private String electricityBillFile;
    private String agreementFile;
    private String installationPhoto;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAadharFile() {
		return aadharFile;
	}

	public void setAadharFile(String aadharFile) {
		this.aadharFile = aadharFile;
	}

	public String getElectricityBillFile() {
		return electricityBillFile;
	}

	public void setElectricityBillFile(String electricityBillFile) {
		this.electricityBillFile = electricityBillFile;
	}

	public String getAgreementFile() {
		return agreementFile;
	}

	public void setAgreementFile(String agreementFile) {
		this.agreementFile = agreementFile;
	}

	public String getInstallationPhoto() {
		return installationPhoto;
	}

	public void setInstallationPhoto(String installationPhoto) {
		this.installationPhoto = installationPhoto;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public String getPanCardFile() {
		return panCardFile;
	}

	public void setPanCardFile(String panCardFile) {
		this.panCardFile = panCardFile;
	}
    
    
    
    
}
