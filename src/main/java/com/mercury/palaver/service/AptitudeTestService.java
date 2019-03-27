package com.mercury.palaver.service;

import com.mercury.palaver.domain.*;
import com.mercury.palaver.repository.AptitudeTestRepository;
import com.mercury.palaver.repository.FocusGroupRepository;
import com.mercury.palaver.repository.TestAnswerOptionRepository;
import com.mercury.palaver.repository.TestQuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AptitudeTestService {

    private final FocusGroupRepository focusGroupRepo;
    private final AptitudeTestRepository aptitudeTestRepo;
    private final TestQuestionRepository testQuestionRepo;
    private final TestAnswerOptionRepository testAnswerOptionRepo;
    private final TestQuestionService testQuestionService;
    private final FocusGroupService focusGroupService;

    public AptitudeTestService(AptitudeTestRepository aptitudeTestRepo,
                               TestQuestionRepository testQuestionRepo,
                               TestAnswerOptionRepository testAnswerOptionRepo,
                               TestQuestionService testQuestionService,
                               FocusGroupRepository focusGroupRepo,
                               FocusGroupService focusGroupService) {
        this.aptitudeTestRepo = aptitudeTestRepo;
        this.testQuestionRepo = testQuestionRepo;
        this.testAnswerOptionRepo = testAnswerOptionRepo;
        this.testQuestionService = testQuestionService;
        this.focusGroupRepo = focusGroupRepo;
        this.focusGroupService = focusGroupService;
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

    public List<AptitudeTest> findAllAvailableByInstitution(Long institutionId) {
        Institution institution = new Institution();
        institution.setId(institutionId);

        List<AptitudeTest> availableTests = new ArrayList<>();
        for (AptitudeTest aptitudeTest : aptitudeTestRepo.findAllByInstitution(institution)) {
            if (focusGroupService.testIsAvailable(aptitudeTest.getId())){
                aptitudeTest.setQuestions(new HashSet<>(testQuestionService.findAllQuestionsAndAnswersByAptitudeTestId(aptitudeTest.getId())));
                availableTests.add(aptitudeTest);
            }
        }
        return availableTests;
    }


    public boolean isInUse(Long testId) {
        AptitudeTest test = new AptitudeTest();
        test.setId(testId);
        Optional<FocusGroup> opt = focusGroupRepo.findByAptitudeTest(test);
        return (opt.isPresent());
    }
}
