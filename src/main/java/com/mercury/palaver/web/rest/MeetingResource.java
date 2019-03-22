package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.Meeting;
import com.mercury.palaver.repository.MeetingRepository;
import com.mercury.palaver.web.rest.errors.BadRequestAlertException;
import com.mercury.palaver.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Meeting.
 */
@RestController
@RequestMapping("/api")
public class MeetingResource {

    private final Logger log = LoggerFactory.getLogger(MeetingResource.class);

    private static final String ENTITY_NAME = "meeting";

    private final MeetingRepository meetingRepository;

    public MeetingResource(MeetingRepository meetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    /**
     * POST  /meetings : Create a new meeting.
     *
     * @param meeting the meeting to create
     * @return the ResponseEntity with status 201 (Created) and with body the new meeting, or with status 400 (Bad Request) if the meeting has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/meetings")
    public ResponseEntity<Meeting> createMeeting(@Valid @RequestBody Meeting meeting) throws URISyntaxException {
        log.debug("REST request to save Meeting : {}", meeting);
        if (meeting.getId() != null) {
            throw new BadRequestAlertException("A new meeting cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Meeting result = meetingRepository.save(meeting);
        return ResponseEntity.created(new URI("/api/meetings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /meetings : Updates an existing meeting.
     *
     * @param meeting the meeting to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated meeting,
     * or with status 400 (Bad Request) if the meeting is not valid,
     * or with status 500 (Internal Server Error) if the meeting couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/meetings")
    public ResponseEntity<Meeting> updateMeeting(@Valid @RequestBody Meeting meeting) throws URISyntaxException {
        log.debug("REST request to update Meeting : {}", meeting);
        if (meeting.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Meeting result = meetingRepository.save(meeting);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, meeting.getId().toString()))
            .body(result);
    }

    /**
     * GET  /meetings : get all the meetings.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of meetings in body
     */
    @GetMapping("/meetings")
    public List<Meeting> getAllMeetings() {
        log.debug("REST request to get all Meetings");
        return meetingRepository.findAll();
    }

    /**
     * GET  /meetings/by-participant/:idParticipant : get the "id" meeting.
     *
     * @param idParticipant the id of the participant to retrieve its meetings
     * @return the ResponseEntity with status 200 (OK) and with body the meeting, or with status 404 (Not Found)
     */
    @GetMapping("/meetings/by-participant/{idParticipant}")
    public List<Meeting> getMeetingByParticipant(@PathVariable Long idParticipant) {
        log.debug("REST request to get Meeting by user id: {}", idParticipant);
        return meetingRepository.findAllByFocusGroup_Participants_Id(idParticipant);
    }

    /**
     * GET  /meetings/by-group/:idGroup : get the group "id" meeting.
     *
     * @param idGroup the id of the group to retrieve its meetings
     * @return the ResponseEntity with status 200 (OK) and with body the meeting, or with status 404 (Not Found)
     */
    @GetMapping("/meetings/by-group/{idGroup}")
    public List<Meeting> getMeetingByGroup(@PathVariable Long idGroup) {
        log.debug("REST request to get Meeting by group id: {}", idGroup);
        return meetingRepository.findAllByFocusGroup_Id(idGroup);
    }

    /**
     * GET  /meetings/:id : get the "id" meeting.
     *
     * @param id the id of the meeting to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the meeting, or with status 404 (Not Found)
     */
    @GetMapping("/meetings/{id}")
    public ResponseEntity<Meeting> getMeeting(@PathVariable Long id) {
        log.debug("REST request to get Meeting : {}", id);
        Optional<Meeting> meeting = meetingRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(meeting);
    }

    /**
     * DELETE  /meetings/:id : delete the "id" meeting.
     *
     * @param id the id of the meeting to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/meetings/{id}")
    public ResponseEntity<Void> deleteMeeting(@PathVariable Long id) {
        log.debug("REST request to delete Meeting : {}", id);
        meetingRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
