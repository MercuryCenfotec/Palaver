package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;

import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.domain.Institution;
import com.mercury.palaver.repository.FocusGroupRepository;
import com.mercury.palaver.service.AptitudeTestService;
import com.mercury.palaver.service.FocusGroupService;
import com.mercury.palaver.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;


import static com.mercury.palaver.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the FocusGroupResource REST controller.
 *
 * @see FocusGroupResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class FocusGroupResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_BEGIN_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_BEGIN_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final Integer DEFAULT_PASSING_GRADE = 1;
    private static final Integer UPDATED_PASSING_GRADE = 2;

    @Autowired
    private FocusGroupRepository focusGroupRepository;

    @Autowired
    private FocusGroupService focusGroupService;

    private AptitudeTestService aptitudeTestService;

    @Mock
    private FocusGroupRepository focusGroupRepositoryMock;

    @Mock
    private FocusGroupService focusGroupServiceMock;

    @Mock
    private AptitudeTestService aptitudeTestServiceMock;

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

    private MockMvc restFocusGroupMockMvc;

    private FocusGroup focusGroup;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final FocusGroupResource focusGroupResource = new FocusGroupResource(focusGroupRepository, focusGroupService, aptitudeTestService);
        this.restFocusGroupMockMvc = MockMvcBuilders.standaloneSetup(focusGroupResource)
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
    public static FocusGroup createEntity(EntityManager em) {
        Long l = new Long(1);
        Institution institution = new Institution();
        institution.setId(l);
        FocusGroup focusGroup = new FocusGroup()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .beginDate(DEFAULT_BEGIN_DATE)
            .endDate(DEFAULT_END_DATE)
            .code(DEFAULT_CODE)
            .passingGrade(DEFAULT_PASSING_GRADE)
            .institution(institution);
        return focusGroup;
    }

    @Before
    public void initTest() {
        focusGroup = createEntity(em);
    }

    @Test
    @Transactional
    public void createFocusGroup() throws Exception {
        int databaseSizeBeforeCreate = focusGroupRepository.findAll().size();

        // Create the FocusGroup
        restFocusGroupMockMvc.perform(post("/api/focus-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(focusGroup)))
            .andExpect(status().isCreated());

        // Validate the FocusGroup in the database
        List<FocusGroup> focusGroupList = focusGroupRepository.findAll();
        assertThat(focusGroupList).hasSize(databaseSizeBeforeCreate + 1);
        FocusGroup testFocusGroup = focusGroupList.get(focusGroupList.size() - 1);
        assertThat(testFocusGroup.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testFocusGroup.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testFocusGroup.getBeginDate()).isEqualTo(DEFAULT_BEGIN_DATE);
        assertThat(testFocusGroup.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testFocusGroup.getPassingGrade()).isEqualTo(DEFAULT_PASSING_GRADE);
    }

    @Test
    @Transactional
    public void createFocusGroupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = focusGroupRepository.findAll().size();

        // Create the FocusGroup with an existing ID
        focusGroup.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFocusGroupMockMvc.perform(post("/api/focus-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(focusGroup)))
            .andExpect(status().isBadRequest());

        // Validate the FocusGroup in the database
        List<FocusGroup> focusGroupList = focusGroupRepository.findAll();
        assertThat(focusGroupList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = focusGroupRepository.findAll().size();
        // set the field null
        focusGroup.setName(null);

        // Create the FocusGroup, which fails.

        restFocusGroupMockMvc.perform(post("/api/focus-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(focusGroup)))
            .andExpect(status().isBadRequest());

        List<FocusGroup> focusGroupList = focusGroupRepository.findAll();
        assertThat(focusGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = focusGroupRepository.findAll().size();
        // set the field null
        focusGroup.setDescription(null);

        // Create the FocusGroup, which fails.

        restFocusGroupMockMvc.perform(post("/api/focus-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(focusGroup)))
            .andExpect(status().isBadRequest());

        List<FocusGroup> focusGroupList = focusGroupRepository.findAll();
        assertThat(focusGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkBeginDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = focusGroupRepository.findAll().size();
        // set the field null
        focusGroup.setBeginDate(null);

        // Create the FocusGroup, which fails.

        restFocusGroupMockMvc.perform(post("/api/focus-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(focusGroup)))
            .andExpect(status().isBadRequest());

        List<FocusGroup> focusGroupList = focusGroupRepository.findAll();
        assertThat(focusGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkEndDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = focusGroupRepository.findAll().size();
        // set the field null
        focusGroup.setEndDate(null);

        // Create the FocusGroup, which fails.

        restFocusGroupMockMvc.perform(post("/api/focus-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(focusGroup)))
            .andExpect(status().isBadRequest());

        List<FocusGroup> focusGroupList = focusGroupRepository.findAll();
        assertThat(focusGroupList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllFocusGroups() throws Exception {
        // Initialize the database
        focusGroupRepository.saveAndFlush(focusGroup);

        // Get all the focusGroupList
        restFocusGroupMockMvc.perform(get("/api/focus-groups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(focusGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].beginDate").value(hasItem(DEFAULT_BEGIN_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].passingGrade").value(hasItem(DEFAULT_PASSING_GRADE)));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllFocusGroupsWithEagerRelationshipsIsEnabled() throws Exception {
        FocusGroupResource focusGroupResource = new FocusGroupResource(focusGroupRepositoryMock, focusGroupServiceMock, aptitudeTestServiceMock);
        when(focusGroupRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restFocusGroupMockMvc = MockMvcBuilders.standaloneSetup(focusGroupResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restFocusGroupMockMvc.perform(get("/api/focus-groups?eagerload=true"))
        .andExpect(status().isOk());

        verify(focusGroupRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllFocusGroupsWithEagerRelationshipsIsNotEnabled() throws Exception {
        FocusGroupResource focusGroupResource = new FocusGroupResource(focusGroupRepositoryMock, focusGroupServiceMock, aptitudeTestServiceMock);
            when(focusGroupRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restFocusGroupMockMvc = MockMvcBuilders.standaloneSetup(focusGroupResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restFocusGroupMockMvc.perform(get("/api/focus-groups?eagerload=true"))
        .andExpect(status().isOk());

            verify(focusGroupRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getFocusGroup() throws Exception {
        // Initialize the database
        focusGroupRepository.saveAndFlush(focusGroup);

        // Get the focusGroup
        restFocusGroupMockMvc.perform(get("/api/focus-groups/{id}", focusGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(focusGroup.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.beginDate").value(DEFAULT_BEGIN_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.passingGrade").value(DEFAULT_PASSING_GRADE));
    }

    @Test
    @Transactional
    public void getNonExistingFocusGroup() throws Exception {
        // Get the focusGroup
        restFocusGroupMockMvc.perform(get("/api/focus-groups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFocusGroup() throws Exception {
        // Initialize the database
        focusGroupRepository.saveAndFlush(focusGroup);

        int databaseSizeBeforeUpdate = focusGroupRepository.findAll().size();

        // Update the focusGroup
        FocusGroup updatedFocusGroup = focusGroupRepository.findById(focusGroup.getId()).get();
        // Disconnect from session so that the updates on updatedFocusGroup are not directly saved in db
        em.detach(updatedFocusGroup);
        updatedFocusGroup
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .beginDate(UPDATED_BEGIN_DATE)
            .endDate(UPDATED_END_DATE)
            .code(UPDATED_CODE)
            .passingGrade(UPDATED_PASSING_GRADE);

        restFocusGroupMockMvc.perform(put("/api/focus-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFocusGroup)))
            .andExpect(status().isOk());

        // Validate the FocusGroup in the database
        List<FocusGroup> focusGroupList = focusGroupRepository.findAll();
        assertThat(focusGroupList).hasSize(databaseSizeBeforeUpdate);
        FocusGroup testFocusGroup = focusGroupList.get(focusGroupList.size() - 1);
        assertThat(testFocusGroup.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testFocusGroup.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testFocusGroup.getBeginDate()).isEqualTo(UPDATED_BEGIN_DATE);
        assertThat(testFocusGroup.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testFocusGroup.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testFocusGroup.getPassingGrade()).isEqualTo(UPDATED_PASSING_GRADE);
    }

    @Test
    @Transactional
    public void updateNonExistingFocusGroup() throws Exception {
        int databaseSizeBeforeUpdate = focusGroupRepository.findAll().size();

        // Create the FocusGroup

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFocusGroupMockMvc.perform(put("/api/focus-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(focusGroup)))
            .andExpect(status().isBadRequest());

        // Validate the FocusGroup in the database
        List<FocusGroup> focusGroupList = focusGroupRepository.findAll();
        assertThat(focusGroupList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteFocusGroup() throws Exception {
        // Initialize the database
        focusGroupRepository.saveAndFlush(focusGroup);

        int databaseSizeBeforeDelete = focusGroupRepository.findAll().size();

        // Delete the focusGroup
        restFocusGroupMockMvc.perform(delete("/api/focus-groups/{id}", focusGroup.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<FocusGroup> focusGroupList = focusGroupRepository.findAll();
        assertThat(focusGroupList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FocusGroup.class);
        FocusGroup focusGroup1 = new FocusGroup();
        focusGroup1.setId(1L);
        FocusGroup focusGroup2 = new FocusGroup();
        focusGroup2.setId(focusGroup1.getId());
        assertThat(focusGroup1).isEqualTo(focusGroup2);
        focusGroup2.setId(2L);
        assertThat(focusGroup1).isNotEqualTo(focusGroup2);
        focusGroup1.setId(null);
        assertThat(focusGroup1).isNotEqualTo(focusGroup2);
    }
}
