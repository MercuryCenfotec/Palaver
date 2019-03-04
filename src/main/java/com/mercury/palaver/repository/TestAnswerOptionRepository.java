package com.mercury.palaver.repository;

import com.mercury.palaver.domain.TestAnswerOption;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TestAnswerOption entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TestAnswerOptionRepository extends JpaRepository<TestAnswerOption, Long> {

}
