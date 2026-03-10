package com.crm.repository;

import com.crm.dto.LeaderboardDTO;
import com.crm.entity.Finance;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FinanceRepository extends JpaRepository<Finance, Long> {

    @Query("SELECT SUM(f.loanAmount) FROM Finance f")
    Double getTotalFinanceAmount();

    @Query("""
    SELECT new com.crm.dto.LeaderboardDTO(
           u.username,
           COUNT(c.id),
           COALESCE(SUM(f.loanAmount),0)
    )
    FROM Customer c
    JOIN c.owner u
    LEFT JOIN Finance f ON f.customer = c
    WHERE c.stage = com.crm.enums.Stage.COMPLETED
    GROUP BY u.username
    ORDER BY COALESCE(SUM(f.loanAmount),0) DESC
    """)
    List<LeaderboardDTO> getSalesLeaderboard();
    
    
    @Query("""
    		SELECT FUNCTION('MONTH', f.createdAt), SUM(f.loanAmount)
    		FROM Finance f
    		GROUP BY FUNCTION('MONTH', f.createdAt)
    		ORDER BY FUNCTION('MONTH', f.createdAt)
    		""")
    		List<Object[]> getMonthlyRevenue();
}