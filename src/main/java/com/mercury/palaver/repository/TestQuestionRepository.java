package com.mercury.palaver.repository;

import com.mercury.palaver.domain.AptitudeTest;
import com.mercury.palaver.domain.TestQuestion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the TestQuestion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TestQuestionRepository extends JpaRepository<TestQuestion, Long> {
    List<TestQuestion> findAllByAptitudeTest(AptitudeTest aptitudeTest);
}
