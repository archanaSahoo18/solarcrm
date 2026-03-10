package com.crm.dto;


public class DashboardResponse {

    private Long totalCustomers;

    private Long identificationCount;
    private Long documentsCount;
    private Long financeCount;
    private Long installationCount;
    private Long contractCount;
    private Long completedCount;

    private Double totalFinanceAmount;
    private Double totalInstallationExpense;
    
    private Long todayFollowUps;
    private Long overdueFollowUps;
    
	public DashboardResponse(Long totalCustomers, Long identificationCount, Long documentsCount, Long financeCount,
			Long installationCount, Long contractCount, Long completedCount, Double totalFinanceAmount,
			Double totalInstallationExpense,Long todayFollowUps,Long overdueFollowUps) {
		this.totalCustomers = totalCustomers;
		this.identificationCount = identificationCount;
		this.documentsCount = documentsCount;
		this.financeCount = financeCount;
		this.installationCount = installationCount;
		this.contractCount = contractCount;
		this.completedCount = completedCount;
		this.totalFinanceAmount = totalFinanceAmount;
		this.totalInstallationExpense = totalInstallationExpense;
		this.todayFollowUps = todayFollowUps;
		this.overdueFollowUps = overdueFollowUps;
	}
	public Long getTotalCustomers() {
		return totalCustomers;
	}
	public void setTotalCustomers(Long totalCustomers) {
		this.totalCustomers = totalCustomers;
	}
	public Long getIdentificationCount() {
		return identificationCount;
	}
	public void setIdentificationCount(Long identificationCount) {
		this.identificationCount = identificationCount;
	}
	public Long getDocumentsCount() {
		return documentsCount;
	}
	public void setDocumentsCount(Long documentsCount) {
		this.documentsCount = documentsCount;
	}
	public Long getFinanceCount() {
		return financeCount;
	}
	public void setFinanceCount(Long financeCount) {
		this.financeCount = financeCount;
	}
	public Long getInstallationCount() {
		return installationCount;
	}
	public void setInstallationCount(Long installationCount) {
		this.installationCount = installationCount;
	}
	public Long getContractCount() {
		return contractCount;
	}
	public void setContractCount(Long contractCount) {
		this.contractCount = contractCount;
	}
	public Long getCompletedCount() {
		return completedCount;
	}
	public void setCompletedCount(Long completedCount) {
		this.completedCount = completedCount;
	}
	public Double getTotalFinanceAmount() {
		return totalFinanceAmount;
	}
	public void setTotalFinanceAmount(Double totalFinanceAmount) {
		this.totalFinanceAmount = totalFinanceAmount;
	}
	public Double getTotalInstallationExpense() {
		return totalInstallationExpense;
	}
	public void setTotalInstallationExpense(Double totalInstallationExpense) {
		this.totalInstallationExpense = totalInstallationExpense;
	}
	public Long getTodayFollowUps() {
		return todayFollowUps;
	}
	public void setTodayFollowUps(Long todayFollowUps) {
		this.todayFollowUps = todayFollowUps;
	}
	public Long getOverdueFollowUps() {
		return overdueFollowUps;
	}
	public void setOverdueFollowUps(Long overdueFollowUps) {
		this.overdueFollowUps = overdueFollowUps;
	}
    
    
	
    
    
    
}