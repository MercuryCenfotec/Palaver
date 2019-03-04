package com.mercury.palaver.repository;

import com.mercury.palaver.domain.Institution;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Institution entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InstitutionRepository extends JpaRepository<Institution, Long> {

}
