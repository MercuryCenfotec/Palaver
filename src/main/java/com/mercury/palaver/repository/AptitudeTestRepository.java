package com.mercury.palaver.repository;

import com.mercury.palaver.domain.AptitudeTest;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the AptitudeTest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AptitudeTestRepository extends JpaRepository<AptitudeTest, Long> {

}
