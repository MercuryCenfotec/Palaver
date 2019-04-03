package com.mercury.palaver.service;

import com.mercury.palaver.domain.Institution;
import com.mercury.palaver.domain.Participant;
import com.mercury.palaver.domain.User;
import com.mercury.palaver.domain.UserApp;
import com.mercury.palaver.repository.InstitutionRepository;
import com.mercury.palaver.repository.ParticipantRepository;
import com.mercury.palaver.repository.UserAppRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserAppService {

    private final UserAppRepository userAppRepo;
    private final InstitutionRepository institutionRepo;
    private final ParticipantRepository participantRepo;

    public UserAppService(UserAppRepository userAppRepo, InstitutionRepository institutionRepo, ParticipantRepository participantRepo) {
        this.userAppRepo = userAppRepo;
        this.institutionRepo = institutionRepo;
        this.participantRepo = participantRepo;
    }

    public boolean specificationCompleted(Long id) {
        User user = new User();
        UserApp userApp = new UserApp();
        user.setId(id);
        Optional<UserApp> opt = userAppRepo.findByUser(user);
        if (opt.isPresent()) userApp = opt.get();

        switch (userApp.getRol()) {
            case "institution":
                return (institutionRepo.findByUser(userApp).isPresent()) ? true : false;
            case "participant":
                return (participantRepo.findByUser(userApp).isPresent()) ? true : false;
        }

        return false;
    }
}
