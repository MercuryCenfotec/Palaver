package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;

import com.mercury.palaver.domain.Ban;
import com.mercury.palaver.domain.Participant;
import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.repository.BanRepository;
import com.mercury.palaver.service.BanService;
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
import java.util.List;


import static com.mercury.palaver.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the BanResource REST controller.
 *
 * @see BanResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class BanResourceIntTest {

    private static final String DEFAULT_REASON = "AAAAAAAAAA";
    private static final String UPDATED_REASON = "BBBBBBBBBB";

    private static final String DEFAULT_COMPLAINT = "AAAAAAAAAA";
    private static final String UPDATED_COMPLAINT = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_VALID = false;
    private static final Boolean UPDATED_IS_VALID = true;

    @Autowired
    private BanRepository banRepository;

    @Autowired
    private BanService banService;

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

    private MockMvc restBanMockMvc;

    private Ban ban;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final BanResource banResource = new BanResource(banService);
        this.restBanMockMvc = MockMvcBuilders.standaloneSetup(banResource)
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
    public static Ban createEntity(EntityManager em) {
        Ban ban = new Ban()
            .reason(DEFAULT_REASON)
            .complaint(DEFAULT_COMPLAINT)
            .isValid(DEFAULT_IS_VALID);
        // Add required entity
        Participant participant = ParticipantResourceIntTest.createEntity(em);
        em.persist(participant);
        em.flush();
        ban.setParticipant(participant);
        // Add required entity
        FocusGroup focusGroup = FocusGroupResourceIntTest.createEntity(em);
        em.persist(focusGroup);
        em.flush();
        ban.setFocusGroup(focusGroup);
        return ban;
    }

    @Before
    public void initTest() {
        ban = createEntity(em);
    }

    @Test
    @Transactional
    public void createBan() throws Exception {
        int databaseSizeBeforeCreate = banRepository.findAll().size();

        // Create the Ban
        restBanMockMvc.perform(post("/api/bans")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(ban)))
            .andExpect(status().isCreated());

        // Validate the Ban in the database
        List<Ban> banList = banRepository.findAll();
        assertThat(banList).hasSize(databaseSizeBeforeCreate + 1);
        Ban testBan = banList.get(banList.size() - 1);
        assertThat(testBan.getReason()).isEqualTo(DEFAULT_REASON);
        assertThat(testBan.getComplaint()).isEqualTo(DEFAULT_COMPLAINT);
        assertThat(testBan.isIsValid()).isEqualTo(DEFAULT_IS_VALID);
    }

    @Test
    @Transactional
    public void createBanWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = banRepository.findAll().size();

        // Create the Ban with an existing ID
        ban.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBanMockMvc.perform(post("/api/bans")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(ban)))
            .andExpect(status().isBadRequest());

        // Validate the Ban in the database
        List<Ban> banList = banRepository.findAll();
        assertThat(banList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllBans() throws Exception {
        // Initialize the database
        banRepository.saveAndFlush(ban);

        // Get all the banList
        restBanMockMvc.perform(get("/api/bans?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ban.getId().intValue())))
            .andExpect(jsonPath("$.[*].reason").value(hasItem(DEFAULT_REASON.toString())))
            .andExpect(jsonPath("$.[*].complaint").value(hasItem(DEFAULT_COMPLAINT.toString())))
            .andExpect(jsonPath("$.[*].isValid").value(hasItem(DEFAULT_IS_VALID.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getBan() throws Exception {
        // Initialize the database
        banRepository.saveAndFlush(ban);

        // Get the ban
        restBanMockMvc.perform(get("/api/bans/{id}", ban.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(ban.getId().intValue()))
            .andExpect(jsonPath("$.reason").value(DEFAULT_REASON.toString()))
            .andExpect(jsonPath("$.complaint").value(DEFAULT_COMPLAINT.toString()))
            .andExpect(jsonPath("$.isValid").value(DEFAULT_IS_VALID.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingBan() throws Exception {
        // Get the ban
        restBanMockMvc.perform(get("/api/bans/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBan() throws Exception {
        // Initialize the database
        banService.save(ban);

        int databaseSizeBeforeUpdate = banRepository.findAll().size();

        // Update the ban
        Ban updatedBan = banRepository.findById(ban.getId()).get();
        // Disconnect from session so that the updates on updatedBan are not directly saved in db
        em.detach(updatedBan);
        updatedBan
            .reason(UPDATED_REASON)
            .complaint(UPDATED_COMPLAINT)
            .isValid(UPDATED_IS_VALID);

        restBanMockMvc.perform(put("/api/bans")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedBan)))
            .andExpect(status().isOk());

        // Validate the Ban in the database
        List<Ban> banList = banRepository.findAll();
        assertThat(banList).hasSize(databaseSizeBeforeUpdate);
        Ban testBan = banList.get(banList.size() - 1);
        assertThat(testBan.getReason()).isEqualTo(UPDATED_REASON);
        assertThat(testBan.getComplaint()).isEqualTo(UPDATED_COMPLAINT);
        assertThat(testBan.isIsValid()).isEqualTo(UPDATED_IS_VALID);
    }

    @Test
    @Transactional
    public void updateNonExistingBan() throws Exception {
        int databaseSizeBeforeUpdate = banRepository.findAll().size();

        // Create the Ban

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBanMockMvc.perform(put("/api/bans")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(ban)))
            .andExpect(status().isBadRequest());

        // Validate the Ban in the database
        List<Ban> banList = banRepository.findAll();
        assertThat(banList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteBan() throws Exception {
        // Initialize the database
        banService.save(ban);

        int databaseSizeBeforeDelete = banRepository.findAll().size();

        // Delete the ban
        restBanMockMvc.perform(delete("/api/bans/{id}", ban.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Ban> banList = banRepository.findAll();
        assertThat(banList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ban.class);
        Ban ban1 = new Ban();
        ban1.setId(1L);
        Ban ban2 = new Ban();
        ban2.setId(ban1.getId());
        assertThat(ban1).isEqualTo(ban2);
        ban2.setId(2L);
        assertThat(ban1).isNotEqualTo(ban2);
        ban1.setId(null);
        assertThat(ban1).isNotEqualTo(ban2);
    }
}
