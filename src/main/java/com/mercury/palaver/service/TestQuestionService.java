package com.mercury.palaver.service;

import com.mercury.palaver.domain.AptitudeTest;
import com.mercury.palaver.domain.TestAnswerOption;
import com.mercury.palaver.domain.TestQuestion;
import com.mercury.palaver.repository.TestAnswerOptionRepository;
import com.mercury.palaver.repository.TestQuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class TestQuestionService {

    private final TestQuestionRepository testQuestionRepo;
    private final TestAnswerOptionRepository testAnswerOptionRepo;

    public TestQuestionService(TestQuestionRepository testQuestionRepo, TestAnswerOptionRepository testAnswerOptionRepo) {
        this.testQuestionRepo = testQuestionRepo;
        this.testAnswerOptionRepo = testAnswerOptionRepo;
    }

    public List<TestQuestion> findAllQuestionsAndAnswersByAptitudeTestId(Long id) {
        AptitudeTest aptitudeTest = new AptitudeTest();
        aptitudeTest.setId(id);
        List<TestQuestion> questions = testQuestionRepo.findAllByAptitudeTest(aptitudeTest);
        for (TestQuestion question : questions) {
            HashSet<TestAnswerOption> answers = testAnswerOptionRepo.findAllByTestQuestion(question);
            question.setAnswers(answers);
        }
        return questions;
    }

    public TestQuestion save(TestQuestion question) {
        testQuestionRepo.save(question);
        for (TestAnswerOption answer : question.getAnswers()) {
            testAnswerOptionRepo.save(answer);
        }
        return question;
    }
}
