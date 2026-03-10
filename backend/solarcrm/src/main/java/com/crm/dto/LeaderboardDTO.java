package com.crm.dto;

public class LeaderboardDTO {

    private String username;
    private Long completedDeals;
    private Double totalRevenue;

    public LeaderboardDTO(String username, Long completedDeals, Double totalRevenue) {
        this.username = username;
        this.completedDeals = completedDeals;
        this.totalRevenue = totalRevenue;
    }

    public String getUsername() { 
    	return username; 
    	}
    public Long getCompletedDeals() { 
    	return completedDeals; 
    	}
    public Double getTotalRevenue() { 
    	return totalRevenue;
    	}
}