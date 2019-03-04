package com.mercury.palaver.repository;

import com.mercury.palaver.domain.TestQuestion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TestQuestion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TestQuestionRepository extends JpaRepository<TestQuestion, Long> {

}
