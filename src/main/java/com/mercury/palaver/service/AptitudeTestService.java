package com.mercury.palaver.service;

import com.mercury.palaver.domain.AptitudeTest;
import com.mercury.palaver.domain.TestAnswerOption;
import com.mercury.palaver.domain.TestQuestion;
import com.mercury.palaver.repository.AptitudeTestRepository;
import com.mercury.palaver.repository.TestAnswerOptionRepository;
import com.mercury.palaver.repository.TestQuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AptitudeTestService {

    private final AptitudeTestRepository aptitudeTestRepo;
    private final TestQuestionRepository testQuestionRepo;
    private final TestAnswerOptionRepository testAnswerOptionRepo;

    public AptitudeTestService(AptitudeTestRepository aptitudeTestRepo,
                               TestQuestionRepository testQuestionRepo,
                               TestAnswerOptionRepository testAnswerOptionRepo) {
        this.aptitudeTestRepo = aptitudeTestRepo;
        this.testQuestionRepo = testQuestionRepo;
        this.testAnswerOptionRepo = testAnswerOptionRepo;
    }

    public AptitudeTest save(AptitudeTest aptitudeTest) {
        aptitudeTest = aptitudeTestRepo.save(aptitudeTest);
        return aptitudeTest;
    }
}
