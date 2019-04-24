package com.mercury.palaver.web.rest;

import com.mercury.palaver.PalaverApp;

import com.mercury.palaver.domain.*;
import com.mercury.palaver.domain.enumeration.CivilStatus;
import com.mercury.palaver.domain.enumeration.Gender;
import com.mercury.palaver.repository.FocusGroupRepository;
import com.mercury.palaver.repository.MeetingRepository;
import com.mercury.palaver.repository.ParticipantRepository;
import com.mercury.palaver.repository.UserAppRepository;
import com.mercury.palaver.service.ZoomApiService;
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
import java.time.LocalDate;
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
 * Test class for the MeetingResource REST controller.
 *
 * @see MeetingResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = PalaverApp.class)
public class MeetingResourceIntTest {

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final ZonedDateTime DEFAULT_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_CALL_URL = "AAAAAAAAAA";
    private static final String UPDATED_CALL_URL = "BBBBBBBBBB";

    private static final String DEFAULT_CALL_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CALL_CODE = "BBBBBBBBBB";

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private UserAppRepository userAppRepository;

    @Autowired
    private FocusGroupRepository focusGroupRepository;

    @Autowired
    private MeetingRepository meetingRepository;

    @Autowired
    private ZoomApiService zoomApiService;

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

    private MockMvc restMeetingMockMvc;

    private Meeting meeting;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MeetingResource meetingResource = new MeetingResource(meetingRepository,zoomApiService);
        this.restMeetingMockMvc = MockMvcBuilders.standaloneSetup(meetingResource)
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
    public static Meeting createEntity(EntityManager em) {
        Meeting meeting = new Meeting()
            .date(DEFAULT_DATE)
            .time(DEFAULT_TIME)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .callURL(DEFAULT_CALL_URL)
            .callCode(DEFAULT_CALL_CODE);
        return meeting;
    }

    @Before
    public void initTest() {
        meeting = createEntity(em);
    }

    @Test
    @Transactional
    public void createMeeting() throws Exception {
        int databaseSizeBeforeCreate = meetingRepository.findAll().size();

        // Create the Meeting
        restMeetingMockMvc.perform(post("/api/meetings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(meeting)))
            .andExpect(status().isCreated());

        // Validate the Meeting in the database
        List<Meeting> meetingList = meetingRepository.findAll();
        assertThat(meetingList).hasSize(databaseSizeBeforeCreate + 1);
        Meeting testMeeting = meetingList.get(meetingList.size() - 1);
        assertThat(testMeeting.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testMeeting.getTime()).isEqualTo(DEFAULT_TIME);
        assertThat(testMeeting.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMeeting.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testMeeting.getCallURL()).contains("https://zoom.us/");
        assertThat(testMeeting.getCallCode()).contains("https://zoom.us/");
    }

    @Test
    @Transactional
    public void createMeetingWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = meetingRepository.findAll().size();

        // Create the Meeting with an existing ID
        meeting.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMeetingMockMvc.perform(post("/api/meetings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(meeting)))
            .andExpect(status().isBadRequest());

        // Validate the Meeting in the database
        List<Meeting> meetingList = meetingRepository.findAll();
        assertThat(meetingList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = meetingRepository.findAll().size();
        // set the field null
        meeting.setDate(null);

        // Create the Meeting, which fails.

        restMeetingMockMvc.perform(post("/api/meetings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(meeting)))
            .andExpect(status().isBadRequest());

        List<Meeting> meetingList = meetingRepository.findAll();
        assertThat(meetingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTimeIsRequired() throws Exception {
        int databaseSizeBeforeTest = meetingRepository.findAll().size();
        // set the field null
        meeting.setTime(null);

        // Create the Meeting, which fails.

        restMeetingMockMvc.perform(post("/api/meetings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(meeting)))
            .andExpect(status().isBadRequest());

        List<Meeting> meetingList = meetingRepository.findAll();
        assertThat(meetingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = meetingRepository.findAll().size();
        // set the field null
        meeting.setName(null);

        // Create the Meeting, which fails.

        restMeetingMockMvc.perform(post("/api/meetings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(meeting)))
            .andExpect(status().isBadRequest());

        List<Meeting> meetingList = meetingRepository.findAll();
        assertThat(meetingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllMeetings() throws Exception {
        // Initialize the database
        meetingRepository.saveAndFlush(meeting);

        // Get all the meetingList
        restMeetingMockMvc.perform(get("/api/meetings?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(meeting.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].time").value(hasItem(sameInstant(DEFAULT_TIME))))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].callURL").value(hasItem(DEFAULT_CALL_URL.toString())))
            .andExpect(jsonPath("$.[*].callCode").value(hasItem(DEFAULT_CALL_CODE.toString())));
    }

    @Test
    @Transactional
    public void getAllMeetingsByParticipant() throws Exception {

        // Get the meeting
        restMeetingMockMvc.perform(get("/ap/meetings/by-participant/{idParticipant}", 1));
    }
    
    @Test
    @Transactional
    public void getMeeting() throws Exception {
        // Initialize the database
        meetingRepository.saveAndFlush(meeting);

        // Get the meeting
        restMeetingMockMvc.perform(get("/api/meetings/{id}", meeting.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(meeting.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.time").value(sameInstant(DEFAULT_TIME)))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.callURL").value(DEFAULT_CALL_URL.toString()))
            .andExpect(jsonPath("$.callCode").value(DEFAULT_CALL_CODE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingMeeting() throws Exception {
        // Get the meeting
        restMeetingMockMvc.perform(get("/api/meetings/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMeeting() throws Exception {
        // Initialize the database
        meetingRepository.saveAndFlush(meeting);

        int databaseSizeBeforeUpdate = meetingRepository.findAll().size();

        // Update the meeting
        Meeting updatedMeeting = meetingRepository.findById(meeting.getId()).get();
        // Disconnect from session so that the updates on updatedMeeting are not directly saved in db
        em.detach(updatedMeeting);
        updatedMeeting
            .date(UPDATED_DATE)
            .time(UPDATED_TIME)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .callURL(UPDATED_CALL_URL)
            .callCode(UPDATED_CALL_CODE);

        restMeetingMockMvc.perform(put("/api/meetings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMeeting)))
            .andExpect(status().isOk());

        // Validate the Meeting in the database
        List<Meeting> meetingList = meetingRepository.findAll();
        assertThat(meetingList).hasSize(databaseSizeBeforeUpdate);
        Meeting testMeeting = meetingList.get(meetingList.size() - 1);
        assertThat(testMeeting.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testMeeting.getTime()).isEqualTo(UPDATED_TIME);
        assertThat(testMeeting.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMeeting.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testMeeting.getCallURL()).isEqualTo(UPDATED_CALL_URL);
        assertThat(testMeeting.getCallCode()).isEqualTo(UPDATED_CALL_CODE);
    }

    @Test
    @Transactional
    public void updateNonExistingMeeting() throws Exception {
        int databaseSizeBeforeUpdate = meetingRepository.findAll().size();

        // Create the Meeting

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMeetingMockMvc.perform(put("/api/meetings")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(meeting)))
            .andExpect(status().isBadRequest());

        // Validate the Meeting in the database
        List<Meeting> meetingList = meetingRepository.findAll();
        assertThat(meetingList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMeeting() throws Exception {
        // Initialize the database
        meetingRepository.saveAndFlush(meeting);

        int databaseSizeBeforeDelete = meetingRepository.findAll().size();

        // Delete the meeting
        restMeetingMockMvc.perform(delete("/api/meetings/{id}", meeting.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Meeting> meetingList = meetingRepository.findAll();
        assertThat(meetingList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Meeting.class);
        Meeting meeting1 = new Meeting();
        meeting1.setId(1L);
        Meeting meeting2 = new Meeting();
        meeting2.setId(meeting1.getId());
        assertThat(meeting1).isEqualTo(meeting2);
        meeting2.setId(2L);
        assertThat(meeting1).isNotEqualTo(meeting2);
        meeting1.setId(null);
        assertThat(meeting1).isNotEqualTo(meeting2);
    }
}
