package com.mercury.palaver.repository;

import com.mercury.palaver.domain.Ban;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Ban entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BanRepository extends JpaRepository<Ban, Long> {
    List<Ban> findAllByIsValid(boolean isValid);
    List<Ban> findAllByIsValidAndFocusGroup_InstitutionId(boolean isValid, Long institutionId);
    List<Ban> findAllByFocusGroup_InstitutionId(Long institutionId);
}
