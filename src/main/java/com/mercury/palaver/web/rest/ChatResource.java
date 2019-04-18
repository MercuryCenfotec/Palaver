package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.Chat;
import com.mercury.palaver.service.ChatService;
import com.mercury.palaver.web.rest.errors.BadRequestAlertException;
import com.mercury.palaver.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Chat.
 */
@RestController
@RequestMapping("/api")
public class ChatResource {

    private final Logger log = LoggerFactory.getLogger(ChatResource.class);

    private static final String ENTITY_NAME = "chat";

    private final ChatService chatService;

    public ChatResource(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * POST  /chats : Create a new chat.
     *
     * @param chat the chat to create
     * @return the ResponseEntity with status 201 (Created) and with body the new chat, or with status 400 (Bad Request) if the chat has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/chats")
    public ResponseEntity<Chat> createChat(@Valid @RequestBody Chat chat) throws URISyntaxException {
        log.debug("REST request to save Chat : {}", chat);
        if (chat.getId() != null) {
            throw new BadRequestAlertException("A new chat cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Chat result = chatService.save(chat);
        return ResponseEntity.created(new URI("/api/chats/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /chats : Updates an existing chat.
     *
     * @param chat the chat to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated chat,
     * or with status 400 (Bad Request) if the chat is not valid,
     * or with status 500 (Internal Server Error) if the chat couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/chats")
    public ResponseEntity<Chat> updateChat(@Valid @RequestBody Chat chat) throws URISyntaxException {
        log.debug("REST request to update Chat : {}", chat);
        if (chat.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Chat result = chatService.save(chat);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, chat.getId().toString()))
            .body(result);
    }

    /**
     * GET  /chats : get all the chats.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of chats in body
     */
    @GetMapping("/chats")
    public List<Chat> getAllChats() {
        log.debug("REST request to get all Chats");
        return chatService.findAll();
    }

    /**
     * GET  /chats/find_by_focus_group/:id : get the "id" focus group of the chat.
     *
     * @param id the id of the chat to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the chat, or with status 404 (Not Found)
     */
    @GetMapping("/chats/find_by_focus_group/{id}")
    public List<Chat> getAllChatsByFocusGroup(@PathVariable Long id) {
        log.debug("REST request to get all Chats by focus group : {}", id);
        return chatService.findAllByFocusGroup(id);
    }

    /**
     * GET  /chats/find_by_participant/:id : get the "id" participant of the chat.
     *
     * @param id the id of the chat to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the chat, or with status 404 (Not Found)
     */
    @GetMapping("/chats/find_by_participant/{id}")
    public List<Chat> getAllChatsByParticipant(@PathVariable Long id) {
        log.debug("REST request to get all Chats by participant : {}", id);
        return chatService.findAllByPartcipant(id);
    }

    /**
     * GET  /chats/:id : get the "id" chat.
     *
     * @param id the id of the chat to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the chat, or with status 404 (Not Found)
     */
    @GetMapping("/chats/{id}")
    public ResponseEntity<Chat> getChat(@PathVariable Long id) {
        log.debug("REST request to get Chat : {}", id);
        Optional<Chat> chat = chatService.findOne(id);
        return ResponseUtil.wrapOrNotFound(chat);
    }

    /**
     * DELETE  /chats/:id : delete the "id" chat.
     *
     * @param id the id of the chat to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/chats/{id}")
    public ResponseEntity<Void> deleteChat(@PathVariable Long id) {
        log.debug("REST request to delete Chat : {}", id);
        chatService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
