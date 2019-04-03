package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;

import com.mercury.palaver.domain.TestQuestion;
import com.mercury.palaver.repository.TestQuestionRepository;
import com.mercury.palaver.service.TestQuestionService;
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
 * Test class for the TestQuestionResource REST controller.
 *
 * @see TestQuestionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class TestQuestionResourceIntTest {

    private static final String DEFAULT_QUESTION = "AAAAAAAAAA";
    private static final String UPDATED_QUESTION = "BBBBBBBBBB";

    @Autowired
    private TestQuestionRepository testQuestionRepository;

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

    private MockMvc restTestQuestionMockMvc;

    private TestQuestion testQuestion;

    @Autowired
    private TestQuestionService testQuestionService;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TestQuestionResource testQuestionResource = new TestQuestionResource(testQuestionRepository, testQuestionService);
        this.restTestQuestionMockMvc = MockMvcBuilders.standaloneSetup(testQuestionResource)
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
    public static TestQuestion createEntity(EntityManager em) {
        TestQuestion testQuestion = new TestQuestion()
            .question(DEFAULT_QUESTION);
        return testQuestion;
    }

    @Before
    public void initTest() {
        testQuestion = createEntity(em);
    }

    @Test
    @Transactional
    public void createTestQuestion() throws Exception {
        int databaseSizeBeforeCreate = testQuestionRepository.findAll().size();

        // Create the TestQuestion
        restTestQuestionMockMvc.perform(post("/api/test-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testQuestion)))
            .andExpect(status().isCreated());

        // Validate the TestQuestion in the database
        List<TestQuestion> testQuestionList = testQuestionRepository.findAll();
        assertThat(testQuestionList).hasSize(databaseSizeBeforeCreate + 1);
        TestQuestion testTestQuestion = testQuestionList.get(testQuestionList.size() - 1);
        assertThat(testTestQuestion.getQuestion()).isEqualTo(DEFAULT_QUESTION);
    }

    @Test
    @Transactional
    public void createTestQuestionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = testQuestionRepository.findAll().size();

        // Create the TestQuestion with an existing ID
        testQuestion.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTestQuestionMockMvc.perform(post("/api/test-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testQuestion)))
            .andExpect(status().isBadRequest());

        // Validate the TestQuestion in the database
        List<TestQuestion> testQuestionList = testQuestionRepository.findAll();
        assertThat(testQuestionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkQuestionIsRequired() throws Exception {
        int databaseSizeBeforeTest = testQuestionRepository.findAll().size();
        // set the field null
        testQuestion.setQuestion(null);

        // Create the TestQuestion, which fails.

        restTestQuestionMockMvc.perform(post("/api/test-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testQuestion)))
            .andExpect(status().isBadRequest());

        List<TestQuestion> testQuestionList = testQuestionRepository.findAll();
        assertThat(testQuestionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTestQuestions() throws Exception {
        // Initialize the database
        testQuestionRepository.saveAndFlush(testQuestion);

        // Get all the testQuestionList
        restTestQuestionMockMvc.perform(get("/api/test-questions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(testQuestion.getId().intValue())))
            .andExpect(jsonPath("$.[*].question").value(hasItem(DEFAULT_QUESTION.toString())));
    }
    
    @Test
    @Transactional
    public void getTestQuestion() throws Exception {
        // Initialize the database
        testQuestionRepository.saveAndFlush(testQuestion);

        // Get the testQuestion
        restTestQuestionMockMvc.perform(get("/api/test-questions/{id}", testQuestion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(testQuestion.getId().intValue()))
            .andExpect(jsonPath("$.question").value(DEFAULT_QUESTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTestQuestion() throws Exception {
        // Get the testQuestion
        restTestQuestionMockMvc.perform(get("/api/test-questions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTestQuestion() throws Exception {
        // Initialize the database
        testQuestionRepository.saveAndFlush(testQuestion);

        int databaseSizeBeforeUpdate = testQuestionRepository.findAll().size();

        // Update the testQuestion
        TestQuestion updatedTestQuestion = testQuestionRepository.findById(testQuestion.getId()).get();
        // Disconnect from session so that the updates on updatedTestQuestion are not directly saved in db
        em.detach(updatedTestQuestion);
        updatedTestQuestion
            .question(UPDATED_QUESTION);

        restTestQuestionMockMvc.perform(put("/api/test-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTestQuestion)))
            .andExpect(status().isOk());

        // Validate the TestQuestion in the database
        List<TestQuestion> testQuestionList = testQuestionRepository.findAll();
        assertThat(testQuestionList).hasSize(databaseSizeBeforeUpdate);
        TestQuestion testTestQuestion = testQuestionList.get(testQuestionList.size() - 1);
        assertThat(testTestQuestion.getQuestion()).isEqualTo(UPDATED_QUESTION);
    }

    @Test
    @Transactional
    public void updateNonExistingTestQuestion() throws Exception {
        int databaseSizeBeforeUpdate = testQuestionRepository.findAll().size();

        // Create the TestQuestion

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTestQuestionMockMvc.perform(put("/api/test-questions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testQuestion)))
            .andExpect(status().isBadRequest());

        // Validate the TestQuestion in the database
        List<TestQuestion> testQuestionList = testQuestionRepository.findAll();
        assertThat(testQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTestQuestion() throws Exception {
        // Initialize the database
        testQuestionRepository.saveAndFlush(testQuestion);

        int databaseSizeBeforeDelete = testQuestionRepository.findAll().size();

        // Delete the testQuestion
        restTestQuestionMockMvc.perform(delete("/api/test-questions/{id}", testQuestion.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TestQuestion> testQuestionList = testQuestionRepository.findAll();
        assertThat(testQuestionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TestQuestion.class);
        TestQuestion testQuestion1 = new TestQuestion();
        testQuestion1.setId(1L);
        TestQuestion testQuestion2 = new TestQuestion();
        testQuestion2.setId(testQuestion1.getId());
        assertThat(testQuestion1).isEqualTo(testQuestion2);
        testQuestion2.setId(2L);
        assertThat(testQuestion1).isNotEqualTo(testQuestion2);
        testQuestion1.setId(null);
        assertThat(testQuestion1).isNotEqualTo(testQuestion2);
    }
}
