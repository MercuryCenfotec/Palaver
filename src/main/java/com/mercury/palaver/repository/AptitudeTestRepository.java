package com.mercury.palaver.repository;

import com.mercury.palaver.domain.AptitudeTest;
import com.mercury.palaver.domain.Institution;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


/**
 * Spring Data  repository for the AptitudeTest entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AptitudeTestRepository extends JpaRepository<AptitudeTest, Long> {
    List<AptitudeTest> findAllByInstitution(Institution institution);
}
