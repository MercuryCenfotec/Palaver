package com.mercury.palaver.repository;

import com.mercury.palaver.domain.TestAnswerOption;
import com.mercury.palaver.domain.TestQuestion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.HashSet;
import java.util.List;


/**
 * Spring Data  repository for the TestAnswerOption entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TestAnswerOptionRepository extends JpaRepository<TestAnswerOption, Long> {
    HashSet<TestAnswerOption> findAllByTestQuestion(TestQuestion testQuestion);
}
