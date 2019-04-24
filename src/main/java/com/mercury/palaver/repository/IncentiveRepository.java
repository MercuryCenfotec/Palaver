package com.mercury.palaver.repository;

import com.mercury.palaver.domain.Incentive;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Incentive entity.
 */
@SuppressWarnings("unused")
@Repository
public interface IncentiveRepository extends JpaRepository<Incentive, Long> {
    List<Incentive> findAllByInstitution_Id(Long id);
    List<Incentive> findAllByInstitution_IdAndQuantityAfter(Long id, int quantity);
}
