package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;

import com.mercury.palaver.domain.TestResult;
import com.mercury.palaver.repository.TestResultRepository;
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
 * Test class for the TestResultResource REST controller.
 *
 * @see TestResultResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class TestResultResourceIntTest {

    private static final String DEFAULT_GRADE = "AAAAAAAAAA";
    private static final String UPDATED_GRADE = "BBBBBBBBBB";

    @Autowired
    private TestResultRepository testResultRepository;

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

    private MockMvc restTestResultMockMvc;

    private TestResult testResult;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TestResultResource testResultResource = new TestResultResource(testResultRepository);
        this.restTestResultMockMvc = MockMvcBuilders.standaloneSetup(testResultResource)
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
    public static TestResult createEntity(EntityManager em) {
        TestResult testResult = new TestResult()
            .grade(DEFAULT_GRADE);
        return testResult;
    }

    @Before
    public void initTest() {
        testResult = createEntity(em);
    }

    @Test
    @Transactional
    public void createTestResult() throws Exception {
        int databaseSizeBeforeCreate = testResultRepository.findAll().size();

        // Create the TestResult
        restTestResultMockMvc.perform(post("/api/test-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testResult)))
            .andExpect(status().isCreated());

        // Validate the TestResult in the database
        List<TestResult> testResultList = testResultRepository.findAll();
        assertThat(testResultList).hasSize(databaseSizeBeforeCreate + 1);
        TestResult testTestResult = testResultList.get(testResultList.size() - 1);
        assertThat(testTestResult.getGrade()).isEqualTo(DEFAULT_GRADE);
    }

    @Test
    @Transactional
    public void createTestResultWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = testResultRepository.findAll().size();

        // Create the TestResult with an existing ID
        testResult.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTestResultMockMvc.perform(post("/api/test-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testResult)))
            .andExpect(status().isBadRequest());

        // Validate the TestResult in the database
        List<TestResult> testResultList = testResultRepository.findAll();
        assertThat(testResultList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkGradeIsRequired() throws Exception {
        int databaseSizeBeforeTest = testResultRepository.findAll().size();
        // set the field null
        testResult.setGrade(null);

        // Create the TestResult, which fails.

        restTestResultMockMvc.perform(post("/api/test-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testResult)))
            .andExpect(status().isBadRequest());

        List<TestResult> testResultList = testResultRepository.findAll();
        assertThat(testResultList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTestResults() throws Exception {
        // Initialize the database
        testResultRepository.saveAndFlush(testResult);

        // Get all the testResultList
        restTestResultMockMvc.perform(get("/api/test-results?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(testResult.getId().intValue())))
            .andExpect(jsonPath("$.[*].grade").value(hasItem(DEFAULT_GRADE.toString())));
    }
    
    @Test
    @Transactional
    public void getTestResult() throws Exception {
        // Initialize the database
        testResultRepository.saveAndFlush(testResult);

        // Get the testResult
        restTestResultMockMvc.perform(get("/api/test-results/{id}", testResult.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(testResult.getId().intValue()))
            .andExpect(jsonPath("$.grade").value(DEFAULT_GRADE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTestResult() throws Exception {
        // Get the testResult
        restTestResultMockMvc.perform(get("/api/test-results/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTestResult() throws Exception {
        // Initialize the database
        testResultRepository.saveAndFlush(testResult);

        int databaseSizeBeforeUpdate = testResultRepository.findAll().size();

        // Update the testResult
        TestResult updatedTestResult = testResultRepository.findById(testResult.getId()).get();
        // Disconnect from session so that the updates on updatedTestResult are not directly saved in db
        em.detach(updatedTestResult);
        updatedTestResult
            .grade(UPDATED_GRADE);

        restTestResultMockMvc.perform(put("/api/test-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTestResult)))
            .andExpect(status().isOk());

        // Validate the TestResult in the database
        List<TestResult> testResultList = testResultRepository.findAll();
        assertThat(testResultList).hasSize(databaseSizeBeforeUpdate);
        TestResult testTestResult = testResultList.get(testResultList.size() - 1);
        assertThat(testTestResult.getGrade()).isEqualTo(UPDATED_GRADE);
    }

    @Test
    @Transactional
    public void updateNonExistingTestResult() throws Exception {
        int databaseSizeBeforeUpdate = testResultRepository.findAll().size();

        // Create the TestResult

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTestResultMockMvc.perform(put("/api/test-results")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(testResult)))
            .andExpect(status().isBadRequest());

        // Validate the TestResult in the database
        List<TestResult> testResultList = testResultRepository.findAll();
        assertThat(testResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTestResult() throws Exception {
        // Initialize the database
        testResultRepository.saveAndFlush(testResult);

        int databaseSizeBeforeDelete = testResultRepository.findAll().size();

        // Delete the testResult
        restTestResultMockMvc.perform(delete("/api/test-results/{id}", testResult.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TestResult> testResultList = testResultRepository.findAll();
        assertThat(testResultList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TestResult.class);
        TestResult testResult1 = new TestResult();
        testResult1.setId(1L);
        TestResult testResult2 = new TestResult();
        testResult2.setId(testResult1.getId());
        assertThat(testResult1).isEqualTo(testResult2);
        testResult2.setId(2L);
        assertThat(testResult1).isNotEqualTo(testResult2);
        testResult1.setId(null);
        assertThat(testResult1).isNotEqualTo(testResult2);
    }
}
