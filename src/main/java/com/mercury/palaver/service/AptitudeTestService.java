package com.mercury.palaver.service;

import com.mercury.palaver.domain.AptitudeTest;
import com.mercury.palaver.domain.Institution;
import com.mercury.palaver.domain.TestAnswerOption;
import com.mercury.palaver.domain.TestQuestion;
import com.mercury.palaver.repository.AptitudeTestRepository;
import com.mercury.palaver.repository.TestAnswerOptionRepository;
import com.mercury.palaver.repository.TestQuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class AptitudeTestService {

    private final AptitudeTestRepository aptitudeTestRepo;
    private final TestQuestionRepository testQuestionRepo;
    private final TestAnswerOptionRepository testAnswerOptionRepo;
    private final TestQuestionService testQuestionService;

    public AptitudeTestService(AptitudeTestRepository aptitudeTestRepo,
                               TestQuestionRepository testQuestionRepo,
                               TestAnswerOptionRepository testAnswerOptionRepo,
                               TestQuestionService testQuestionService) {
        this.aptitudeTestRepo = aptitudeTestRepo;
        this.testQuestionRepo = testQuestionRepo;
        this.testAnswerOptionRepo = testAnswerOptionRepo;
        this.testQuestionService = testQuestionService;
    }

    public AptitudeTest save(AptitudeTest aptitudeTest) {
        aptitudeTest = aptitudeTestRepo.save(aptitudeTest);
        for (TestQuestion question : aptitudeTest.getQuestions()) {
            question.setAptitudeTest(aptitudeTest);
            question = testQuestionRepo.save(question);
            for (TestAnswerOption answer : question.getAnswers()) {
                answer.setTestQuestion(question);
                testAnswerOptionRepo.save(answer);
            }
        }
        return aptitudeTest;
    }

    public List<AptitudeTest> findAllByInstitution(Long institutionId) {
        Institution institution = new Institution();
        institution.setId(institutionId);
        List<AptitudeTest> aptitudeTests = aptitudeTestRepo.findAllByInstitution(institution);
        for (AptitudeTest aptitudeTest : aptitudeTests) {
            aptitudeTest.setQuestions(new HashSet<>(testQuestionService.findAllQuestionsAndAnswersByAptitudeTestId(aptitudeTest.getId())));
        }
        return aptitudeTests;
    }
}
