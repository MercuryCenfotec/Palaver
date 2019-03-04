package com.mercury.palaver.repository;

import com.mercury.palaver.domain.SystemVariable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the SystemVariable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SystemVariableRepository extends JpaRepository<SystemVariable, Long> {

}
