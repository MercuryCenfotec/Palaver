package com.mercury.palaver.service;

import com.mercury.palaver.domain.Ban;
import com.mercury.palaver.repository.BanRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Ban.
 */
@Service
@Transactional
public class BanService {

    private final Logger log = LoggerFactory.getLogger(BanService.class);

    private final BanRepository banRepository;

    public BanService(BanRepository banRepository) {
        this.banRepository = banRepository;
    }

    /**
     * Save a ban.
     *
     * @param ban the entity to save
     * @return the persisted entity
     */
    public Ban save(Ban ban) {
        log.debug("Request to save Ban : {}", ban);
        return banRepository.save(ban);
    }

    /**
     * Get all the bans.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Ban> findAll() {
        log.debug("Request to get all Bans");
        return banRepository.findAll();
    }


    /**
     * Get one ban by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Ban> findOne(Long id) {
        log.debug("Request to get Ban : {}", id);
        return banRepository.findById(id);
    }

    /**
     * Delete the ban by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Ban : {}", id);        banRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Ban> findAllByStatus(boolean isValid) {
        log.debug("Request to get all Bans");
        return banRepository.findAllByIsValid(isValid);
    }

    @Transactional(readOnly = true)
    public List<Ban> findAllByStatusAndInstitution(boolean isValid, Long id) {
        log.debug("Request to get all Bans");
        return banRepository.findAllByIsValidAndFocusGroup_InstitutionId(isValid, id);
    }

    @Transactional(readOnly = true)
    public List<Ban> findAllByInstitution(Long id) {
        log.debug("Request to get all Bans");
        return banRepository.findAllByFocusGroup_InstitutionId(id);
    }

    @Transactional(readOnly = true)
    public List<Ban> findAllByParticipant(Long id) {
        log.debug("Request to get all Bans");
        return banRepository.findAllByParticipantId(id);
    }
}
