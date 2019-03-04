package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;

import com.mercury.palaver.domain.SystemVariable;
import com.mercury.palaver.repository.SystemVariableRepository;
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
 * Test class for the SystemVariableResource REST controller.
 *
 * @see SystemVariableResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class SystemVariableResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_VALUE = "AAAAAAAAAA";
    private static final String UPDATED_VALUE = "BBBBBBBBBB";

    @Autowired
    private SystemVariableRepository systemVariableRepository;

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

    private MockMvc restSystemVariableMockMvc;

    private SystemVariable systemVariable;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SystemVariableResource systemVariableResource = new SystemVariableResource(systemVariableRepository);
        this.restSystemVariableMockMvc = MockMvcBuilders.standaloneSetup(systemVariableResource)
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
    public static SystemVariable createEntity(EntityManager em) {
        SystemVariable systemVariable = new SystemVariable()
            .name(DEFAULT_NAME)
            .code(DEFAULT_CODE)
            .value(DEFAULT_VALUE);
        return systemVariable;
    }

    @Before
    public void initTest() {
        systemVariable = createEntity(em);
    }

    @Test
    @Transactional
    public void createSystemVariable() throws Exception {
        int databaseSizeBeforeCreate = systemVariableRepository.findAll().size();

        // Create the SystemVariable
        restSystemVariableMockMvc.perform(post("/api/system-variables")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(systemVariable)))
            .andExpect(status().isCreated());

        // Validate the SystemVariable in the database
        List<SystemVariable> systemVariableList = systemVariableRepository.findAll();
        assertThat(systemVariableList).hasSize(databaseSizeBeforeCreate + 1);
        SystemVariable testSystemVariable = systemVariableList.get(systemVariableList.size() - 1);
        assertThat(testSystemVariable.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSystemVariable.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testSystemVariable.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    public void createSystemVariableWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = systemVariableRepository.findAll().size();

        // Create the SystemVariable with an existing ID
        systemVariable.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSystemVariableMockMvc.perform(post("/api/system-variables")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(systemVariable)))
            .andExpect(status().isBadRequest());

        // Validate the SystemVariable in the database
        List<SystemVariable> systemVariableList = systemVariableRepository.findAll();
        assertThat(systemVariableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = systemVariableRepository.findAll().size();
        // set the field null
        systemVariable.setName(null);

        // Create the SystemVariable, which fails.

        restSystemVariableMockMvc.perform(post("/api/system-variables")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(systemVariable)))
            .andExpect(status().isBadRequest());

        List<SystemVariable> systemVariableList = systemVariableRepository.findAll();
        assertThat(systemVariableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = systemVariableRepository.findAll().size();
        // set the field null
        systemVariable.setCode(null);

        // Create the SystemVariable, which fails.

        restSystemVariableMockMvc.perform(post("/api/system-variables")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(systemVariable)))
            .andExpect(status().isBadRequest());

        List<SystemVariable> systemVariableList = systemVariableRepository.findAll();
        assertThat(systemVariableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = systemVariableRepository.findAll().size();
        // set the field null
        systemVariable.setValue(null);

        // Create the SystemVariable, which fails.

        restSystemVariableMockMvc.perform(post("/api/system-variables")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(systemVariable)))
            .andExpect(status().isBadRequest());

        List<SystemVariable> systemVariableList = systemVariableRepository.findAll();
        assertThat(systemVariableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSystemVariables() throws Exception {
        // Initialize the database
        systemVariableRepository.saveAndFlush(systemVariable);

        // Get all the systemVariableList
        restSystemVariableMockMvc.perform(get("/api/system-variables?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(systemVariable.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.toString())));
    }
    
    @Test
    @Transactional
    public void getSystemVariable() throws Exception {
        // Initialize the database
        systemVariableRepository.saveAndFlush(systemVariable);

        // Get the systemVariable
        restSystemVariableMockMvc.perform(get("/api/system-variables/{id}", systemVariable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(systemVariable.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSystemVariable() throws Exception {
        // Get the systemVariable
        restSystemVariableMockMvc.perform(get("/api/system-variables/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSystemVariable() throws Exception {
        // Initialize the database
        systemVariableRepository.saveAndFlush(systemVariable);

        int databaseSizeBeforeUpdate = systemVariableRepository.findAll().size();

        // Update the systemVariable
        SystemVariable updatedSystemVariable = systemVariableRepository.findById(systemVariable.getId()).get();
        // Disconnect from session so that the updates on updatedSystemVariable are not directly saved in db
        em.detach(updatedSystemVariable);
        updatedSystemVariable
            .name(UPDATED_NAME)
            .code(UPDATED_CODE)
            .value(UPDATED_VALUE);

        restSystemVariableMockMvc.perform(put("/api/system-variables")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSystemVariable)))
            .andExpect(status().isOk());

        // Validate the SystemVariable in the database
        List<SystemVariable> systemVariableList = systemVariableRepository.findAll();
        assertThat(systemVariableList).hasSize(databaseSizeBeforeUpdate);
        SystemVariable testSystemVariable = systemVariableList.get(systemVariableList.size() - 1);
        assertThat(testSystemVariable.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSystemVariable.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testSystemVariable.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    public void updateNonExistingSystemVariable() throws Exception {
        int databaseSizeBeforeUpdate = systemVariableRepository.findAll().size();

        // Create the SystemVariable

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSystemVariableMockMvc.perform(put("/api/system-variables")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(systemVariable)))
            .andExpect(status().isBadRequest());

        // Validate the SystemVariable in the database
        List<SystemVariable> systemVariableList = systemVariableRepository.findAll();
        assertThat(systemVariableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteSystemVariable() throws Exception {
        // Initialize the database
        systemVariableRepository.saveAndFlush(systemVariable);

        int databaseSizeBeforeDelete = systemVariableRepository.findAll().size();

        // Delete the systemVariable
        restSystemVariableMockMvc.perform(delete("/api/system-variables/{id}", systemVariable.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<SystemVariable> systemVariableList = systemVariableRepository.findAll();
        assertThat(systemVariableList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SystemVariable.class);
        SystemVariable systemVariable1 = new SystemVariable();
        systemVariable1.setId(1L);
        SystemVariable systemVariable2 = new SystemVariable();
        systemVariable2.setId(systemVariable1.getId());
        assertThat(systemVariable1).isEqualTo(systemVariable2);
        systemVariable2.setId(2L);
        assertThat(systemVariable1).isNotEqualTo(systemVariable2);
        systemVariable1.setId(null);
        assertThat(systemVariable1).isNotEqualTo(systemVariable2);
    }
}
