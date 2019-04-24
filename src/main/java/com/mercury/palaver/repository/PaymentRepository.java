package com.mercury.palaver.repository;

import com.mercury.palaver.domain.Payment;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Payment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByDescription(String description);
    List<Payment> findAllByDescriptionContaining(String description);
}
