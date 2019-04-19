package com.mercury.palaver.service;

import com.mercury.palaver.domain.Chat;
import com.mercury.palaver.repository.ChatRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing Chat.
 */
@Service
@Transactional
public class ChatService {

    private final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final ChatRepository chatRepository;

    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    /**
     * Save a chat.
     *
     * @param chat the entity to save
     * @return the persisted entity
     */
    public Chat save(Chat chat) {
        log.debug("Request to save Chat : {}", chat);
        return chatRepository.save(chat);
    }

    /**
     * Get all the chats.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<Chat> findAll() {
        log.debug("Request to get all Chats");
        return chatRepository.findAll();
    }


    /**
     * Get all chats by participant id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public List<Chat> findAllByPartcipant(Long id) {
        log.debug("Request to get all Chats by participant: {}", id);
        return chatRepository.findAllByParticipant_IdOrderByLastSendAsc(id);
    }


    /**
     * Get all chats by focus group id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public List<Chat> findAllByFocusGroup(Long id) {
        log.debug("Request to get all Chats by focus group: {}", id);
        return chatRepository.findAllByFocusGroup_IdOrderByLastSendAsc(id);
    }


    /**
     * Get one chat by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<Chat> findOne(Long id) {
        log.debug("Request to get Chat : {}", id);
        return chatRepository.findById(id);
    }

    /**
     * Delete the chat by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Chat : {}", id);
        chatRepository.deleteById(id);
    }
}
