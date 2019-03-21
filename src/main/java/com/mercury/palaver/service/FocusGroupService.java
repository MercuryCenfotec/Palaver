package com.mercury.palaver.service;

import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.domain.TestAnswerOption;
import com.mercury.palaver.domain.TestQuestion;
import com.mercury.palaver.repository.FocusGroupRepository;
import com.mercury.palaver.repository.TestAnswerOptionRepository;
import com.mercury.palaver.service.util.DateUtil;
import com.mercury.palaver.service.util.MD5;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

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

    public boolean isCancelable(Long groupId) {
        Optional<FocusGroup> opt = focusGroupRepo.findById(groupId);
        if (opt.isPresent()) {
            FocusGroup group = opt.get();
            if (!group.getParticipants().isEmpty()) return false;
            if (group.getBeginDate().isBefore(LocalDate.now())) return false;
            if (group.getEndDate().isBefore(LocalDate.now())) return false;
            return true;
        }
        return false;
    }
}
