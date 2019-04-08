package com.mercury.palaver.service;

import com.mercury.palaver.domain.Notification;
import com.mercury.palaver.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Notification.
 */
@Service
@Transactional
public class NotificationService {

    private final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Save a notification.
     *
     * @param notification the entity to save
     * @return the persisted entity
     */
    public Notification save(Notification notification) {
        log.debug("Request to save Notification : {}", notification);
        return notificationRepository.save(notification);
    }

    /**
     * Get all the notifications.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Notification> findAll() {
        log.debug("Request to get all Notifications");
        return notificationRepository.findAll();
    }


    /**
     * Get one notification by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Notification> findOne(Long id) {
        log.debug("Request to get Notification : {}", id);
        return notificationRepository.findById(id);
    }

    /**
     * Delete the notification by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Notification : {}", id);        notificationRepository.deleteById(id);
    }
}
