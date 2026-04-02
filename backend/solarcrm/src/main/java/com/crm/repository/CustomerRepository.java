package com.crm.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.crm.entity.Customer;
import com.crm.enums.Stage;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    long countByStage(Stage stage);
    long count();

    boolean existsByPhone(String phone);


    // loads finance + installation + contract automatically
    @EntityGraph(attributePaths = {
            "finance",
            "installation",
            "contract"
    })
    Page<Customer> findAll(Pageable pageable);



    // same method name used in service
    @EntityGraph(attributePaths = {
            "finance",
            "installation",
            "contract"
    })
    Page<Customer> findByOwnerId(Long ownerId, Pageable pageable);



    @EntityGraph(attributePaths = {
            "finance",
            "installation",
            "contract"
    })
    Optional<Customer> findWithDetailsById(Long id);

}