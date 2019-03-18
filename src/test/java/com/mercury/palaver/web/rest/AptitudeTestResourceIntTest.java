package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;

import com.mercury.palaver.domain.AptitudeTest;
import com.mercury.palaver.repository.AptitudeTestRepository;
import com.mercury.palaver.service.AptitudeTestService;
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
 * Test class for the AptitudeTestResource REST controller.
 *
 * @see AptitudeTestResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class AptitudeTestResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CREATED_DATE = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_DATE = "BBBBBBBBBB";

    @Autowired
    private AptitudeTestRepository aptitudeTestRepository;

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

    private MockMvc restAptitudeTestMockMvc;

    private AptitudeTest aptitudeTest;

    private AptitudeTestService aptitudeTestService;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AptitudeTestResource aptitudeTestResource = new AptitudeTestResource(aptitudeTestRepository, aptitudeTestService);
        this.restAptitudeTestMockMvc = MockMvcBuilders.standaloneSetup(aptitudeTestResource)
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
    public static AptitudeTest createEntity(EntityManager em) {
        AptitudeTest aptitudeTest = new AptitudeTest()
            .name(DEFAULT_NAME)
            .createdDate(DEFAULT_CREATED_DATE);
        return aptitudeTest;
    }

    @Before
    public void initTest() {
        aptitudeTest = createEntity(em);
    }

    @Test
    @Transactional
    public void createAptitudeTest() throws Exception {
        int databaseSizeBeforeCreate = aptitudeTestRepository.findAll().size();

        // Create the AptitudeTest
        restAptitudeTestMockMvc.perform(post("/api/aptitude-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(aptitudeTest)))
            .andExpect(status().isCreated());

        // Validate the AptitudeTest in the database
        List<AptitudeTest> aptitudeTestList = aptitudeTestRepository.findAll();
        assertThat(aptitudeTestList).hasSize(databaseSizeBeforeCreate + 1);
        AptitudeTest testAptitudeTest = aptitudeTestList.get(aptitudeTestList.size() - 1);
        assertThat(testAptitudeTest.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAptitudeTest.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
    }

    @Test
    @Transactional
    public void createAptitudeTestWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = aptitudeTestRepository.findAll().size();

        // Create the AptitudeTest with an existing ID
        aptitudeTest.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAptitudeTestMockMvc.perform(post("/api/aptitude-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(aptitudeTest)))
            .andExpect(status().isBadRequest());

        // Validate the AptitudeTest in the database
        List<AptitudeTest> aptitudeTestList = aptitudeTestRepository.findAll();
        assertThat(aptitudeTestList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = aptitudeTestRepository.findAll().size();
        // set the field null
        aptitudeTest.setName(null);

        // Create the AptitudeTest, which fails.

        restAptitudeTestMockMvc.perform(post("/api/aptitude-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(aptitudeTest)))
            .andExpect(status().isBadRequest());

        List<AptitudeTest> aptitudeTestList = aptitudeTestRepository.findAll();
        assertThat(aptitudeTestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCreatedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = aptitudeTestRepository.findAll().size();
        // set the field null
        aptitudeTest.setCreatedDate(null);

        // Create the AptitudeTest, which fails.

        restAptitudeTestMockMvc.perform(post("/api/aptitude-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(aptitudeTest)))
            .andExpect(status().isBadRequest());

        List<AptitudeTest> aptitudeTestList = aptitudeTestRepository.findAll();
        assertThat(aptitudeTestList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAptitudeTests() throws Exception {
        // Initialize the database
        aptitudeTestRepository.saveAndFlush(aptitudeTest);

        // Get all the aptitudeTestList
        restAptitudeTestMockMvc.perform(get("/api/aptitude-tests?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(aptitudeTest.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getAptitudeTest() throws Exception {
        // Initialize the database
        aptitudeTestRepository.saveAndFlush(aptitudeTest);

        // Get the aptitudeTest
        restAptitudeTestMockMvc.perform(get("/api/aptitude-tests/{id}", aptitudeTest.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(aptitudeTest.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingAptitudeTest() throws Exception {
        // Get the aptitudeTest
        restAptitudeTestMockMvc.perform(get("/api/aptitude-tests/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAptitudeTest() throws Exception {
        // Initialize the database
        aptitudeTestRepository.saveAndFlush(aptitudeTest);

        int databaseSizeBeforeUpdate = aptitudeTestRepository.findAll().size();

        // Update the aptitudeTest
        AptitudeTest updatedAptitudeTest = aptitudeTestRepository.findById(aptitudeTest.getId()).get();
        // Disconnect from session so that the updates on updatedAptitudeTest are not directly saved in db
        em.detach(updatedAptitudeTest);
        updatedAptitudeTest
            .name(UPDATED_NAME)
            .createdDate(UPDATED_CREATED_DATE);

        restAptitudeTestMockMvc.perform(put("/api/aptitude-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAptitudeTest)))
            .andExpect(status().isOk());

        // Validate the AptitudeTest in the database
        List<AptitudeTest> aptitudeTestList = aptitudeTestRepository.findAll();
        assertThat(aptitudeTestList).hasSize(databaseSizeBeforeUpdate);
        AptitudeTest testAptitudeTest = aptitudeTestList.get(aptitudeTestList.size() - 1);
        assertThat(testAptitudeTest.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAptitudeTest.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingAptitudeTest() throws Exception {
        int databaseSizeBeforeUpdate = aptitudeTestRepository.findAll().size();

        // Create the AptitudeTest

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAptitudeTestMockMvc.perform(put("/api/aptitude-tests")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(aptitudeTest)))
            .andExpect(status().isBadRequest());

        // Validate the AptitudeTest in the database
        List<AptitudeTest> aptitudeTestList = aptitudeTestRepository.findAll();
        assertThat(aptitudeTestList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteAptitudeTest() throws Exception {
        // Initialize the database
        aptitudeTestRepository.saveAndFlush(aptitudeTest);

        int databaseSizeBeforeDelete = aptitudeTestRepository.findAll().size();

        // Delete the aptitudeTest
        restAptitudeTestMockMvc.perform(delete("/api/aptitude-tests/{id}", aptitudeTest.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<AptitudeTest> aptitudeTestList = aptitudeTestRepository.findAll();
        assertThat(aptitudeTestList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AptitudeTest.class);
        AptitudeTest aptitudeTest1 = new AptitudeTest();
        aptitudeTest1.setId(1L);
        AptitudeTest aptitudeTest2 = new AptitudeTest();
        aptitudeTest2.setId(aptitudeTest1.getId());
        assertThat(aptitudeTest1).isEqualTo(aptitudeTest2);
        aptitudeTest2.setId(2L);
        assertThat(aptitudeTest1).isNotEqualTo(aptitudeTest2);
        aptitudeTest1.setId(null);
        assertThat(aptitudeTest1).isNotEqualTo(aptitudeTest2);
    }
}
