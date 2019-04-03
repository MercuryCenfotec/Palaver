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

    public AptitudeTestService(AptitudeTestRepository aptitudeTestRepo,
                               TestQuestionRepository testQuestionRepo,
                               TestAnswerOptionRepository testAnswerOptionRepo,
                               TestQuestionService testQuestionService,
                               FocusGroupRepository focusGroupRepo) {
        this.aptitudeTestRepo = aptitudeTestRepo;
        this.testQuestionRepo = testQuestionRepo;
        this.testAnswerOptionRepo = testAnswerOptionRepo;
        this.testQuestionService = testQuestionService;
        this.focusGroupRepo = focusGroupRepo;
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

    public AptitudeTest update(AptitudeTest test) {
        AptitudeTest tempTest = new AptitudeTest();
        tempTest.setName(test.getName());
        tempTest.setInstitution(test.getInstitution());
        tempTest.setCreatedDate(test.getCreatedDate());
        tempTest.setId(test.getId());
        for (TestQuestion question : test.getQuestions()) {
            if (question.getId() == null) {
                question.setAptitudeTest(test);
                question = testQuestionRepo.save(question);
                for (TestAnswerOption answer : question.getAnswers()) {
                    answer.setTestQuestion(question);
                    testAnswerOptionRepo.save(answer);
                }
            } else if (question.getQuestion().equals("delete")) {
                testQuestionService.delete(question.getId());
            } else {
                tempTest.addQuestions(question);
            }
        }
        return aptitudeTestRepo.save(tempTest);
    }

    public AptitudeTest clone(AptitudeTest aptitudeTest) {
        aptitudeTest.setId(null);
        aptitudeTest = aptitudeTestRepo.save(aptitudeTest);
        for (TestQuestion question : aptitudeTest.getQuestions()) {
            question.setId(null);
            question.setAptitudeTest(aptitudeTest);
            question = testQuestionRepo.save(question);
            for (TestAnswerOption answer : question.getAnswers()) {
                answer.setId(null);
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
            if (testIsAvailable(aptitudeTest.getId())) {
                aptitudeTest.setQuestions(new HashSet<>(testQuestionService.findAllQuestionsAndAnswersByAptitudeTestId(aptitudeTest.getId())));
                availableTests.add(aptitudeTest);
            }
        }
        return availableTests;
    }

    public boolean delete(Long testId) {
        Optional<AptitudeTest> opt = aptitudeTestRepo.findById(testId);
        if (opt.isPresent()) {
            for (TestQuestion question : opt.get().getQuestions()) {
                testQuestionService.delete(question.getId());
            }
            aptitudeTestRepo.delete(opt.get());
        }
        return false;
    }


    public boolean isInUse(Long testId) {
        AptitudeTest test = new AptitudeTest();
        test.setId(testId);
        Optional<FocusGroup> opt = focusGroupRepo.findByAptitudeTest(test);
        return (opt.isPresent());
    }

    public boolean testIsAvailable(Long testId) {
        AptitudeTest test = new AptitudeTest();
        test.setId(testId);
        Optional<FocusGroup> opt = focusGroupRepo.findByAptitudeTest(test);
        return !opt.isPresent();
    }
}
