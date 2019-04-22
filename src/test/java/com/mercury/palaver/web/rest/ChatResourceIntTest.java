package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;

import com.mercury.palaver.domain.Chat;
import com.mercury.palaver.domain.Participant;
import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.repository.ChatRepository;
import com.mercury.palaver.service.ChatService;
import com.mercury.palaver.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;


import static com.mercury.palaver.web.rest.TestUtil.sameInstant;
import static com.mercury.palaver.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ChatResource REST controller.
 *
 * @see ChatResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class ChatResourceIntTest {

    private static final ZonedDateTime DEFAULT_LAST_SEND = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAST_SEND = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_LAST_MESSAGE = "AAAAAAAAAA";
    private static final String UPDATED_LAST_MESSAGE = "BBBBBBBBBB";

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ChatService chatService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restChatMockMvc;

    private Chat chat;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ChatResource chatResource = new ChatResource(chatService);
        this.restChatMockMvc = MockMvcBuilders.standaloneSetup(chatResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chat createEntity(EntityManager em) {
        Chat chat = new Chat()
            .lastSend(DEFAULT_LAST_SEND)
            .lastMessage(DEFAULT_LAST_MESSAGE);
        // Add required entity
        Participant participant = ParticipantResourceIntTest.createEntity(em);
        em.persist(participant);
        em.flush();
        chat.setParticipant(participant);
        // Add required entity
        FocusGroup focusGroup = FocusGroupResourceIntTest.createEntity(em);
        em.persist(focusGroup);
        em.flush();
        chat.setFocusGroup(focusGroup);
        return chat;
    }

    @Before
    public void initTest() {
        chat = createEntity(em);
    }

    @Test
    @Transactional
    public void createChat() throws Exception {
        int databaseSizeBeforeCreate = chatRepository.findAll().size();

        // Create the Chat
        restChatMockMvc.perform(post("/api/chats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chat)))
            .andExpect(status().isCreated());

        // Validate the Chat in the database
        List<Chat> chatList = chatRepository.findAll();
        assertThat(chatList).hasSize(databaseSizeBeforeCreate + 1);
        Chat testChat = chatList.get(chatList.size() - 1);
        assertThat(testChat.getLastSend()).isEqualTo(DEFAULT_LAST_SEND);
        assertThat(testChat.getLastMessage()).isEqualTo(DEFAULT_LAST_MESSAGE);
    }

    @Test
    @Transactional
    public void createChatWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = chatRepository.findAll().size();

        // Create the Chat with an existing ID
        chat.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restChatMockMvc.perform(post("/api/chats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chat)))
            .andExpect(status().isBadRequest());

        // Validate the Chat in the database
        List<Chat> chatList = chatRepository.findAll();
        assertThat(chatList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllChats() throws Exception {
        // Initialize the database
        chatRepository.saveAndFlush(chat);

        // Get all the chatList
        restChatMockMvc.perform(get("/api/chats?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chat.getId().intValue())))
            .andExpect(jsonPath("$.[*].lastSend").value(hasItem(sameInstant(DEFAULT_LAST_SEND))))
            .andExpect(jsonPath("$.[*].lastMessage").value(hasItem(DEFAULT_LAST_MESSAGE.toString())));
    }
    
    @Test
    @Transactional
    public void getChat() throws Exception {
        // Initialize the database
        chatRepository.saveAndFlush(chat);

        // Get the chat
        restChatMockMvc.perform(get("/api/chats/{id}", chat.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(chat.getId().intValue()))
            .andExpect(jsonPath("$.lastSend").value(sameInstant(DEFAULT_LAST_SEND)))
            .andExpect(jsonPath("$.lastMessage").value(DEFAULT_LAST_MESSAGE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingChat() throws Exception {
        // Get the chat
        restChatMockMvc.perform(get("/api/chats/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateChat() throws Exception {
        // Initialize the database
        chatService.save(chat);

        int databaseSizeBeforeUpdate = chatRepository.findAll().size();

        // Update the chat
        Chat updatedChat = chatRepository.findById(chat.getId()).get();
        // Disconnect from session so that the updates on updatedChat are not directly saved in db
        em.detach(updatedChat);
        updatedChat
            .lastSend(UPDATED_LAST_SEND)
            .lastMessage(UPDATED_LAST_MESSAGE);

        restChatMockMvc.perform(put("/api/chats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedChat)))
            .andExpect(status().isOk());

        // Validate the Chat in the database
        List<Chat> chatList = chatRepository.findAll();
        assertThat(chatList).hasSize(databaseSizeBeforeUpdate);
        Chat testChat = chatList.get(chatList.size() - 1);
        assertThat(testChat.getLastSend()).isEqualTo(UPDATED_LAST_SEND);
        assertThat(testChat.getLastMessage()).isEqualTo(UPDATED_LAST_MESSAGE);
    }

    @Test
    @Transactional
    public void updateNonExistingChat() throws Exception {
        int databaseSizeBeforeUpdate = chatRepository.findAll().size();

        // Create the Chat

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChatMockMvc.perform(put("/api/chats")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chat)))
            .andExpect(status().isBadRequest());

        // Validate the Chat in the database
        List<Chat> chatList = chatRepository.findAll();
        assertThat(chatList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteChat() throws Exception {
        // Initialize the database
        chatService.save(chat);

        int databaseSizeBeforeDelete = chatRepository.findAll().size();

        // Delete the chat
        restChatMockMvc.perform(delete("/api/chats/{id}", chat.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Chat> chatList = chatRepository.findAll();
        assertThat(chatList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Chat.class);
        Chat chat1 = new Chat();
        chat1.setId(1L);
        Chat chat2 = new Chat();
        chat2.setId(chat1.getId());
        assertThat(chat1).isEqualTo(chat2);
        chat2.setId(2L);
        assertThat(chat1).isNotEqualTo(chat2);
        chat1.setId(null);
        assertThat(chat1).isNotEqualTo(chat2);
    }
}
