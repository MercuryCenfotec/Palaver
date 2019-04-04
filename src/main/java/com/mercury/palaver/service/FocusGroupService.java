package com.mercury.palaver.service;

import com.mercury.palaver.domain.AptitudeTest;
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
    private final UserService userService;
    private final AptitudeTestService aptitudeTestService;

    public FocusGroupService(TestAnswerOptionRepository testAnswerOptionRepo, FocusGroupRepository focusGroupRepo, UserService userService, AptitudeTestService aptitudeTestService) {
        this.testAnswerOptionRepo = testAnswerOptionRepo;
        this.focusGroupRepo = focusGroupRepo;
        this.userService = userService;
        this.aptitudeTestService = aptitudeTestService;
    }

    public FocusGroup save(FocusGroup group) {
        String code = MD5.getMd5(group.getName() + DateUtil.getDate());
        userService.registerGroupManagementUser(code);
        group.setCode(code);
        if (group.getAptitudeTest() != null) processAptitudeTest(group);
        group = focusGroupRepo.save(group);
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

    public boolean testIsAvailable(Long testId) {
        AptitudeTest test = new AptitudeTest();
        test.setId(testId);
        Optional<FocusGroup> opt = focusGroupRepo.findByAptitudeTest(test);
        return !opt.isPresent();
    }

    private void processAptitudeTest(FocusGroup group){
        if (!aptitudeTestService.testIsAvailable(group.getAptitudeTest().getId())) {
            group.getAptitudeTest().setName("Copia - " +group.getAptitudeTest().getName());
            group.setAptitudeTest(aptitudeTestService.clone(group.getAptitudeTest()));
        } else {
            for (TestQuestion question : group.getAptitudeTest().getQuestions()) {
                for (TestAnswerOption answer : question.getAnswers()) {
                    if (answer.isDesired()) testAnswerOptionRepo.save(answer);
                }
            }
        }
    }
}
