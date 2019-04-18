package com.mercury.palaver.repository;

import com.mercury.palaver.domain.AptitudeTest;
import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.domain.Institution;
import org.springframework.cglib.core.Local;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the FocusGroup entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FocusGroupRepository extends JpaRepository<FocusGroup, Long> {

    @Query(value = "select distinct focus_group from FocusGroup focus_group left join fetch focus_group.categories left join fetch focus_group.participants",
        countQuery = "select count(distinct focus_group) from FocusGroup focus_group")
    Page<FocusGroup> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct focus_group from FocusGroup focus_group left join fetch focus_group.categories left join fetch focus_group.participants")
    List<FocusGroup> findAllWithEagerRelationships();

    @Query("select focus_group from FocusGroup focus_group left join fetch focus_group.categories left join fetch focus_group.participants where focus_group.id =:id")
    Optional<FocusGroup> findOneWithEagerRelationships(@Param("id") Long id);

    Optional<FocusGroup> findByCode(String code);

    Optional<FocusGroup> findByAptitudeTest(AptitudeTest test);

    List<FocusGroup> findAllByInstitution(Institution institution);

    List<FocusGroup> findAllByIncentive_IdAndBeginDateIsBeforeAndEndDateIsAfter(Long id, LocalDate beginDate, LocalDate endDate);
}
