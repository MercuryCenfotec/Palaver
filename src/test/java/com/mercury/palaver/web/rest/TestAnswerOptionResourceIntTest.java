package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;

import com.mercury.palaver.domain.TestAnswerOption;
import com.mercury.palaver.repository.TestAnswerOptionRepository;
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
 * Test class for the TestAnswerOptionResource REST controller.
 *
 * @see TestAnswerOptionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class TestAnswerOptionResourceIntTest {

    private static final String DEFAULT_ANSWER = "AAAAAAAAAA";
    private static final String UPDATED_ANSWER = "BBBBBBBBBB";

    private static final Boolean DEFAULT_DESIRED = false;
    private static final Boolean UPDATED_DESIRED = true;

    @Autowired
    private TestAnswerOptionRepository testAnswerOptionRepository;

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

    private MockMvc restTestAnswerOptionMockMvc;

    private TestAnswerOption testAnswerOption;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TestAnswerOptionResource testAnswerOptionResource = new TestAnswerOptionResource(testAnswerOptionRepository);
        this.restTestAnswerOptionMockMvc = MockMvcBuilders.standaloneSetup(testAnswerOptionResource)
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
    public static TestAnswerOption createEntity(EntityManager em) {
        TestAnswerOption testAnswerOption = new TestAnswerOption()
            .answer(DEFAULT_ANSWER)
            .desired(DEFAULT_DESIRED);
        return testAnswerOption;
    }

    @Before
    public void initTest() {
        testAnswerOption = createEntity(em);
    }

    @Test
    @Transactional
    public void createTestAnswerOption() throws Exception {
        int databaseSizeBeforeCreate = testAnswerOptionRepository.findAll().size();

        // Create the TestAnswerOption
        restTestAnswerOptionMockMvc.perform(post("/api/test-answer-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testAnswerOption)))
            .andExpect(status().isCreated());

        // Validate the TestAnswerOption in the database
        List<TestAnswerOption> testAnswerOptionList = testAnswerOptionRepository.findAll();
        assertThat(testAnswerOptionList).hasSize(databaseSizeBeforeCreate + 1);
        TestAnswerOption testTestAnswerOption = testAnswerOptionList.get(testAnswerOptionList.size() - 1);
        assertThat(testTestAnswerOption.getAnswer()).isEqualTo(DEFAULT_ANSWER);
        assertThat(testTestAnswerOption.isDesired()).isEqualTo(DEFAULT_DESIRED);
    }

    @Test
    @Transactional
    public void createTestAnswerOptionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = testAnswerOptionRepository.findAll().size();

        // Create the TestAnswerOption with an existing ID
        testAnswerOption.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTestAnswerOptionMockMvc.perform(post("/api/test-answer-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testAnswerOption)))
            .andExpect(status().isBadRequest());

        // Validate the TestAnswerOption in the database
        List<TestAnswerOption> testAnswerOptionList = testAnswerOptionRepository.findAll();
        assertThat(testAnswerOptionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkAnswerIsRequired() throws Exception {
        int databaseSizeBeforeTest = testAnswerOptionRepository.findAll().size();
        // set the field null
        testAnswerOption.setAnswer(null);

        // Create the TestAnswerOption, which fails.

        restTestAnswerOptionMockMvc.perform(post("/api/test-answer-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testAnswerOption)))
            .andExpect(status().isBadRequest());

        List<TestAnswerOption> testAnswerOptionList = testAnswerOptionRepository.findAll();
        assertThat(testAnswerOptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDesiredIsRequired() throws Exception {
        int databaseSizeBeforeTest = testAnswerOptionRepository.findAll().size();
        // set the field null
        testAnswerOption.setDesired(null);

        // Create the TestAnswerOption, which fails.

        restTestAnswerOptionMockMvc.perform(post("/api/test-answer-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testAnswerOption)))
            .andExpect(status().isBadRequest());

        List<TestAnswerOption> testAnswerOptionList = testAnswerOptionRepository.findAll();
        assertThat(testAnswerOptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTestAnswerOptions() throws Exception {
        // Initialize the database
        testAnswerOptionRepository.saveAndFlush(testAnswerOption);

        // Get all the testAnswerOptionList
        restTestAnswerOptionMockMvc.perform(get("/api/test-answer-options?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(testAnswerOption.getId().intValue())))
            .andExpect(jsonPath("$.[*].answer").value(hasItem(DEFAULT_ANSWER.toString())))
            .andExpect(jsonPath("$.[*].desired").value(hasItem(DEFAULT_DESIRED.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getTestAnswerOption() throws Exception {
        // Initialize the database
        testAnswerOptionRepository.saveAndFlush(testAnswerOption);

        // Get the testAnswerOption
        restTestAnswerOptionMockMvc.perform(get("/api/test-answer-options/{id}", testAnswerOption.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(testAnswerOption.getId().intValue()))
            .andExpect(jsonPath("$.answer").value(DEFAULT_ANSWER.toString()))
            .andExpect(jsonPath("$.desired").value(DEFAULT_DESIRED.booleanValue()));
    }

    @Test
    @Transactional
    public void getNonExistingTestAnswerOption() throws Exception {
        // Get the testAnswerOption
        restTestAnswerOptionMockMvc.perform(get("/api/test-answer-options/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTestAnswerOption() throws Exception {
        // Initialize the database
        testAnswerOptionRepository.saveAndFlush(testAnswerOption);

        int databaseSizeBeforeUpdate = testAnswerOptionRepository.findAll().size();

        // Update the testAnswerOption
        TestAnswerOption updatedTestAnswerOption = testAnswerOptionRepository.findById(testAnswerOption.getId()).get();
        // Disconnect from session so that the updates on updatedTestAnswerOption are not directly saved in db
        em.detach(updatedTestAnswerOption);
        updatedTestAnswerOption
            .answer(UPDATED_ANSWER)
            .desired(UPDATED_DESIRED);

        restTestAnswerOptionMockMvc.perform(put("/api/test-answer-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTestAnswerOption)))
            .andExpect(status().isOk());

        // Validate the TestAnswerOption in the database
        List<TestAnswerOption> testAnswerOptionList = testAnswerOptionRepository.findAll();
        assertThat(testAnswerOptionList).hasSize(databaseSizeBeforeUpdate);
        TestAnswerOption testTestAnswerOption = testAnswerOptionList.get(testAnswerOptionList.size() - 1);
        assertThat(testTestAnswerOption.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testTestAnswerOption.isDesired()).isEqualTo(UPDATED_DESIRED);
    }

    @Test
    @Transactional
    public void updateNonExistingTestAnswerOption() throws Exception {
        int databaseSizeBeforeUpdate = testAnswerOptionRepository.findAll().size();

        // Create the TestAnswerOption

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTestAnswerOptionMockMvc.perform(put("/api/test-answer-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testAnswerOption)))
            .andExpect(status().isBadRequest());

        // Validate the TestAnswerOption in the database
        List<TestAnswerOption> testAnswerOptionList = testAnswerOptionRepository.findAll();
        assertThat(testAnswerOptionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTestAnswerOption() throws Exception {
        // Initialize the database
        testAnswerOptionRepository.saveAndFlush(testAnswerOption);

        int databaseSizeBeforeDelete = testAnswerOptionRepository.findAll().size();

        // Delete the testAnswerOption
        restTestAnswerOptionMockMvc.perform(delete("/api/test-answer-options/{id}", testAnswerOption.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TestAnswerOption> testAnswerOptionList = testAnswerOptionRepository.findAll();
        assertThat(testAnswerOptionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TestAnswerOption.class);
        TestAnswerOption testAnswerOption1 = new TestAnswerOption();
        testAnswerOption1.setId(1L);
        TestAnswerOption testAnswerOption2 = new TestAnswerOption();
        testAnswerOption2.setId(testAnswerOption1.getId());
        assertThat(testAnswerOption1).isEqualTo(testAnswerOption2);
        testAnswerOption2.setId(2L);
        assertThat(testAnswerOption1).isNotEqualTo(testAnswerOption2);
        testAnswerOption1.setId(null);
        assertThat(testAnswerOption1).isNotEqualTo(testAnswerOption2);
    }
}
