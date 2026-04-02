package com.crm.dto;

public class InstallationRequest {

    private String teamName;
    private String status;
    private String scheduledAt;
    private String notes;

    private Double materialCost;
    private Double labourCost;
	public String getTeamName() {
		return teamName;
	}
	public void setTeamName(String teamName) {
		this.teamName = teamName;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getScheduledAt() {
		return scheduledAt;
	}
	public void setScheduledAt(String scheduledAt) {
		this.scheduledAt = scheduledAt;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}
	public Double getMaterialCost() {
		return materialCost;
	}
	public void setMaterialCost(Double materialCost) {
		this.materialCost = materialCost;
	}
	public Double getLabourCost() {
		return labourCost;
	}
	public void setLabourCost(Double labourCost) {
		this.labourCost = labourCost;
	}
    
    
    
}
