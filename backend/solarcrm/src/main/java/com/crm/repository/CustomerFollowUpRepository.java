package com.crm.repository;

import com.crm.entity.FollowUp;
import com.crm.enums.FollowUpStatus;
import com.crm.entity.User;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CustomerFollowUpRepository extends JpaRepository<FollowUp, Long> {

    /* ---------------------------------------------------------
       BASIC FOLLOWUP QUERIES
    --------------------------------------------------------- */

    List<FollowUp> findByCustomerIdOrderByFollowUpDateDesc(Long customerId);

    Optional<FollowUp> findFirstByCustomerIdAndStatusOrderByFollowUpDateAsc(
            Long customerId,
            FollowUpStatus status
    );

    List<FollowUp> findByAssignedUserAndStatus(User assignedUser, FollowUpStatus status);



    /* ---------------------------------------------------------
       TODAY FOLLOWUPS (USER)
    --------------------------------------------------------- */

    @Query("""
        select f from FollowUp f
        where f.status = :status
          and f.assignedUser.id = :ownerId
          and f.followUpDate >= :start
          and f.followUpDate < :end
        order by f.followUpDate asc
    """)
    List<FollowUp> findTodayForOwner(
            @Param("ownerId") Long ownerId,
            @Param("status") FollowUpStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );



    /* ---------------------------------------------------------
       OVERDUE FOLLOWUPS (USER)
    --------------------------------------------------------- */

    @Query("""
        select f from FollowUp f
        where f.status = :status
          and f.assignedUser.id = :ownerId
          and f.followUpDate < :startOfToday
        order by f.followUpDate asc
    """)
    List<FollowUp> findOverdueForOwner(
            @Param("ownerId") Long ownerId,
            @Param("status") FollowUpStatus status,
            @Param("startOfToday") LocalDateTime startOfToday,
            Pageable pageable
    );



    /* ---------------------------------------------------------
       COUNT TODAY FOLLOWUPS (USER)
    --------------------------------------------------------- */

    @Query("""
        select count(f) from FollowUp f
        where f.status = :status
          and f.assignedUser.id = :ownerId
          and f.followUpDate >= :start
          and f.followUpDate < :end
    """)
    Long countTodayForOwner(
            @Param("ownerId") Long ownerId,
            @Param("status") FollowUpStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );



    /* ---------------------------------------------------------
       COUNT OVERDUE FOLLOWUPS (USER)
    --------------------------------------------------------- */

    @Query("""
        select count(f) from FollowUp f
        where f.status = :status
          and f.assignedUser.id = :ownerId
          and f.followUpDate < :startOfToday
    """)
    Long countOverdueForOwner(
            @Param("ownerId") Long ownerId,
            @Param("status") FollowUpStatus status,
            @Param("startOfToday") LocalDateTime startOfToday
    );



    /* ---------------------------------------------------------
       COUNT TODAY FOLLOWUPS (ADMIN)
    --------------------------------------------------------- */

    @Query("""
        select count(f) from FollowUp f
        where f.status = :status
          and f.followUpDate >= :start
          and f.followUpDate < :end
    """)
    Long countAllToday(
            @Param("status") FollowUpStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );



    /* ---------------------------------------------------------
       COUNT OVERDUE FOLLOWUPS (ADMIN)
    --------------------------------------------------------- */

    @Query("""
        select count(f) from FollowUp f
        where f.status = :status
          and f.followUpDate < :startOfToday
    """)
    Long countAllOverdue(
            @Param("status") FollowUpStatus status,
            @Param("startOfToday") LocalDateTime startOfToday
    );

    List<FollowUp> findByFollowUpDateBetween(LocalDateTime start, LocalDateTime end);

    List<FollowUp> findByFollowUpDateBefore(LocalDateTime date);
    
}