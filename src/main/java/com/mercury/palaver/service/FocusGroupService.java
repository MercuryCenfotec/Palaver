package com.mercury.palaver.service;

import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.domain.TestAnswerOption;
import com.mercury.palaver.domain.TestQuestion;
import com.mercury.palaver.repository.FocusGroupRepository;
import com.mercury.palaver.repository.TestAnswerOptionRepository;
import com.mercury.palaver.service.util.MD5;
import com.mercury.palaver.service.util.DateUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class FocusGroupService {

    private final TestAnswerOptionRepository testAnswerOptionRepo;
    private final FocusGroupRepository focusGroupRepo;

    public FocusGroupService(TestAnswerOptionRepository testAnswerOptionRepo, FocusGroupRepository focusGroupRepo) {
        this.testAnswerOptionRepo = testAnswerOptionRepo;
        this.focusGroupRepo = focusGroupRepo;
    }

    public FocusGroup save(FocusGroup group) {
        group.setCode(MD5.getMd5(group.getName() + DateUtil.getDate()));
        group = focusGroupRepo.save(group);
        if (group.getAptitudeTest() != null) {
            for (TestQuestion question : group.getAptitudeTest().getQuestions()) {
                for (TestAnswerOption answer : question.getAnswers()) {
                    if (answer.isDesired()) testAnswerOptionRepo.save(answer);
                }
            }
        }
        return group;
    }
}
