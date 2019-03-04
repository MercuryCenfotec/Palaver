package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;

import com.mercury.palaver.domain.Incentive;
import com.mercury.palaver.repository.IncentiveRepository;
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
 * Test class for the IncentiveResource REST controller.
 *
 * @see IncentiveResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class IncentiveResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_IMAGE = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE = "BBBBBBBBBB";

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private IncentiveRepository incentiveRepository;

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

    private MockMvc restIncentiveMockMvc;

    private Incentive incentive;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final IncentiveResource incentiveResource = new IncentiveResource(incentiveRepository);
        this.restIncentiveMockMvc = MockMvcBuilders.standaloneSetup(incentiveResource)
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
    public static Incentive createEntity(EntityManager em) {
        Incentive incentive = new Incentive()
            .name(DEFAULT_NAME)
            .image(DEFAULT_IMAGE)
            .quantity(DEFAULT_QUANTITY)
            .description(DEFAULT_DESCRIPTION);
        return incentive;
    }

    @Before
    public void initTest() {
        incentive = createEntity(em);
    }

    @Test
    @Transactional
    public void createIncentive() throws Exception {
        int databaseSizeBeforeCreate = incentiveRepository.findAll().size();

        // Create the Incentive
        restIncentiveMockMvc.perform(post("/api/incentives")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(incentive)))
            .andExpect(status().isCreated());

        // Validate the Incentive in the database
        List<Incentive> incentiveList = incentiveRepository.findAll();
        assertThat(incentiveList).hasSize(databaseSizeBeforeCreate + 1);
        Incentive testIncentive = incentiveList.get(incentiveList.size() - 1);
        assertThat(testIncentive.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testIncentive.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testIncentive.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
        assertThat(testIncentive.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createIncentiveWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = incentiveRepository.findAll().size();

        // Create the Incentive with an existing ID
        incentive.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restIncentiveMockMvc.perform(post("/api/incentives")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(incentive)))
            .andExpect(status().isBadRequest());

        // Validate the Incentive in the database
        List<Incentive> incentiveList = incentiveRepository.findAll();
        assertThat(incentiveList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = incentiveRepository.findAll().size();
        // set the field null
        incentive.setName(null);

        // Create the Incentive, which fails.

        restIncentiveMockMvc.perform(post("/api/incentives")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(incentive)))
            .andExpect(status().isBadRequest());

        List<Incentive> incentiveList = incentiveRepository.findAll();
        assertThat(incentiveList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkQuantityIsRequired() throws Exception {
        int databaseSizeBeforeTest = incentiveRepository.findAll().size();
        // set the field null
        incentive.setQuantity(null);

        // Create the Incentive, which fails.

        restIncentiveMockMvc.perform(post("/api/incentives")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(incentive)))
            .andExpect(status().isBadRequest());

        List<Incentive> incentiveList = incentiveRepository.findAll();
        assertThat(incentiveList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllIncentives() throws Exception {
        // Initialize the database
        incentiveRepository.saveAndFlush(incentive);

        // Get all the incentiveList
        restIncentiveMockMvc.perform(get("/api/incentives?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(incentive.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].image").value(hasItem(DEFAULT_IMAGE.toString())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }
    
    @Test
    @Transactional
    public void getIncentive() throws Exception {
        // Initialize the database
        incentiveRepository.saveAndFlush(incentive);

        // Get the incentive
        restIncentiveMockMvc.perform(get("/api/incentives/{id}", incentive.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(incentive.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.image").value(DEFAULT_IMAGE.toString()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingIncentive() throws Exception {
        // Get the incentive
        restIncentiveMockMvc.perform(get("/api/incentives/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateIncentive() throws Exception {
        // Initialize the database
        incentiveRepository.saveAndFlush(incentive);

        int databaseSizeBeforeUpdate = incentiveRepository.findAll().size();

        // Update the incentive
        Incentive updatedIncentive = incentiveRepository.findById(incentive.getId()).get();
        // Disconnect from session so that the updates on updatedIncentive are not directly saved in db
        em.detach(updatedIncentive);
        updatedIncentive
            .name(UPDATED_NAME)
            .image(UPDATED_IMAGE)
            .quantity(UPDATED_QUANTITY)
            .description(UPDATED_DESCRIPTION);

        restIncentiveMockMvc.perform(put("/api/incentives")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedIncentive)))
            .andExpect(status().isOk());

        // Validate the Incentive in the database
        List<Incentive> incentiveList = incentiveRepository.findAll();
        assertThat(incentiveList).hasSize(databaseSizeBeforeUpdate);
        Incentive testIncentive = incentiveList.get(incentiveList.size() - 1);
        assertThat(testIncentive.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testIncentive.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testIncentive.getQuantity()).isEqualTo(UPDATED_QUANTITY);
        assertThat(testIncentive.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingIncentive() throws Exception {
        int databaseSizeBeforeUpdate = incentiveRepository.findAll().size();

        // Create the Incentive

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIncentiveMockMvc.perform(put("/api/incentives")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(incentive)))
            .andExpect(status().isBadRequest());

        // Validate the Incentive in the database
        List<Incentive> incentiveList = incentiveRepository.findAll();
        assertThat(incentiveList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteIncentive() throws Exception {
        // Initialize the database
        incentiveRepository.saveAndFlush(incentive);

        int databaseSizeBeforeDelete = incentiveRepository.findAll().size();

        // Delete the incentive
        restIncentiveMockMvc.perform(delete("/api/incentives/{id}", incentive.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Incentive> incentiveList = incentiveRepository.findAll();
        assertThat(incentiveList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Incentive.class);
        Incentive incentive1 = new Incentive();
        incentive1.setId(1L);
        Incentive incentive2 = new Incentive();
        incentive2.setId(incentive1.getId());
        assertThat(incentive1).isEqualTo(incentive2);
        incentive2.setId(2L);
        assertThat(incentive1).isNotEqualTo(incentive2);
        incentive1.setId(null);
        assertThat(incentive1).isNotEqualTo(incentive2);
    }
}
