package com.crm.service;

import com.crm.dto.DashboardResponse;
import com.crm.enums.Role;
import com.crm.enums.Stage;
import com.crm.enums.FollowUpStatus;
import com.crm.repository.CustomerFollowUpRepository;
import com.crm.repository.CustomerRepository;
import com.crm.repository.FinanceRepository;
import com.crm.repository.InstallationRepository;



import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final FinanceRepository financeRepository;
    private final InstallationRepository installationRepository;
    private final CustomerFollowUpRepository followUpRepository;
    
    



    public DashboardService(CustomerRepository customerRepository, FinanceRepository financeRepository,
			InstallationRepository installationRepository, CustomerFollowUpRepository followUpRepository) {
		this.customerRepository = customerRepository;
		this.financeRepository = financeRepository;
		this.installationRepository = installationRepository;
		this.followUpRepository = followUpRepository;
	}



	public DashboardResponse getDashboardData(Long userId, Role role) {

        Long totalCustomers = customerRepository.count();

        Long identificationCount = customerRepository.countByStage(Stage.IDENTIFICATION);
        Long documentsCount = customerRepository.countByStage(Stage.DOCUMENTS);
        Long financeCount = customerRepository.countByStage(Stage.FINANCE);
        Long installationCount = customerRepository.countByStage(Stage.INSTALLATION);
        Long contractCount = customerRepository.countByStage(Stage.CONTRACT);
        Long completedCount = customerRepository.countByStage(Stage.COMPLETED);

        Double totalFinance = financeRepository.getTotalFinanceAmount();
        Double totalExpense = installationRepository.getTotalInstallationExpense();

        if (totalFinance == null) totalFinance = 0.0;
        if (totalExpense == null) totalExpense = 0.0;

        LocalDateTime startOfToday = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfToday = startOfToday.plusDays(1);

        Long todayCount;
        Long overdueCount;

        if (role == Role.ADMIN) {

            todayCount = followUpRepository.countAllToday(
                    FollowUpStatus.SCHEDULED,
                    startOfToday,
                    endOfToday
            );

            overdueCount = followUpRepository.countAllOverdue(
                    FollowUpStatus.SCHEDULED,
                    startOfToday
            );

        } else {

            todayCount = followUpRepository.countTodayForOwner(
                    userId,
                    FollowUpStatus.SCHEDULED,
                    startOfToday,
                    endOfToday
            );

            overdueCount = followUpRepository.countOverdueForOwner(
                    userId,
                    FollowUpStatus.SCHEDULED,
                    startOfToday
            );
        }

        return new DashboardResponse(
                totalCustomers,
                identificationCount,
                documentsCount,
                financeCount,
                installationCount,
                contractCount,
                completedCount,
                totalFinance,
                totalExpense,
                todayCount,
                overdueCount
        );
    }



    public Map<Integer, Double> getMonthlyRevenue() {

        List<Object[]> result = financeRepository.getMonthlyRevenue();

        Map<Integer, Double> revenueMap = new HashMap<>();

        for (Object[] row : result) {
            Integer month = (Integer) row[0];
            Double revenue = (Double) row[1];
            revenueMap.put(month, revenue);
        }

        return revenueMap;
    }
}