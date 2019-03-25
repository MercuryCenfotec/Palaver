package com.mercury.palaver.repository;

import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.domain.TestResult;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the TestResult entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findAllByFocusGroup(FocusGroup group);
}
