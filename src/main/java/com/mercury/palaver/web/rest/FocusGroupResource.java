package com.mercury.palaver.web.rest;

import com.mercury.palaver.domain.AptitudeTest;
import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.domain.Institution;
import com.mercury.palaver.repository.FocusGroupRepository;
import com.mercury.palaver.service.FocusGroupService;
import com.mercury.palaver.service.PaymentService;
import com.mercury.palaver.web.rest.errors.BadRequestAlertException;
import com.mercury.palaver.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing FocusGroup.
 */
@RestController
@RequestMapping("/api")
public class FocusGroupResource {

    private final Logger log = LoggerFactory.getLogger(FocusGroupResource.class);

    private static final String ENTITY_NAME = "focusGroup";

    private final FocusGroupRepository focusGroupRepository;
    private final FocusGroupService focusGroupService;
    private final PaymentService paymentService;

    public FocusGroupResource(FocusGroupRepository focusGroupRepository, FocusGroupService focusGroupService, PaymentService paymentService) {
        this.focusGroupRepository = focusGroupRepository;
        this.focusGroupService = focusGroupService;
        this.paymentService = paymentService;
    }

    /**
     * POST  /focus-groups : Create a new focusGroup.
     *
     * @param focusGroup the focusGroup to create
     * @return the ResponseEntity with status 201 (Created) and with body the new focusGroup, or with status 400 (Bad Request) if the focusGroup has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/focus-groups")
    public ResponseEntity<FocusGroup> createFocusGroup(@Valid @RequestBody FocusGroup focusGroup) throws URISyntaxException {
        log.debug("REST request to save FocusGroup : {}", focusGroup);
        if (focusGroup.getId() != null) {
            throw new BadRequestAlertException("A new focusGroup cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FocusGroup result = focusGroupService.save(focusGroup);
        return ResponseEntity.created(new URI("/api/focus-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /focus-groups : Updates an existing focusGroup.
     *
     * @param focusGroup the focusGroup to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated focusGroup,
     * or with status 400 (Bad Request) if the focusGroup is not valid,
     * or with status 500 (Internal Server Error) if the focusGroup couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/focus-groups")
    public ResponseEntity<FocusGroup> updateFocusGroup(@Valid @RequestBody FocusGroup focusGroup) throws URISyntaxException {
        log.debug("REST request to update FocusGroup : {}", focusGroup);
        if (focusGroup.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        FocusGroup result = focusGroupRepository.save(focusGroup);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, focusGroup.getId().toString()))
            .body(result);
    }

    /**
     * GET  /focus-groups/find_by_incentive : get all the focusGroups.
     *
     * @param id the id of the focusGroup's incentive to retrieve
     * @return the ResponseEntity with status 200 (OK) and the list of focusGroups in body
     */
    @GetMapping("/focus-groups/find_by_incentive/{id}")
    public List<FocusGroup> getAllFocusGroupsByIncentive(@PathVariable Long id) {
        log.debug("REST request to get all FocusGroups by incentive id active right now :{}",id);
        LocalDate hoy = LocalDate.now();
        LocalDate ayer = hoy.minusDays(1);
        return focusGroupRepository.findAllByIncentive_IdAndBeginDateIsBeforeAndEndDateIsAfter(id, ayer,hoy);
    }

    /**
     * GET  /focus-groups : get all the focusGroups.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many)
     * @return the ResponseEntity with status 200 (OK) and the list of focusGroups in body
     */
    @GetMapping("/focus-groups")
    public List<FocusGroup> getAllFocusGroups(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all FocusGroups");
        return focusGroupRepository.findAllWithEagerRelationships();
    }

    /**
     * GET  /focus-groups/:id : get the "id" focusGroup.
     *
     * @param id the id of the focusGroup to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the focusGroup, or with status 404 (Not Found)
     */
    @GetMapping("/focus-groups/{id}")
    public ResponseEntity<FocusGroup> getFocusGroup(@PathVariable Long id) {
        log.debug("REST request to get FocusGroup : {}", id);
        Optional<FocusGroup> focusGroup = focusGroupRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(focusGroup);
    }

    /**
     * DELETE  /focus-groups/:id : delete the "id" focusGroup.
     *
     * @param id the id of the focusGroup to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/focus-groups/{id}")
    public ResponseEntity<Void> deleteFocusGroup(@PathVariable Long id) {
        log.debug("REST request to delete FocusGroup : {}", id);
        Optional<FocusGroup> opt = focusGroupRepository.findById(id);
        paymentService.returnFocusGroupPayment(opt.get());
        focusGroupRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @PostMapping("/focus-groups/merge")
    public void mergeFocusGroup(@Valid @RequestBody FocusGroup focusGroup) {

        EntityManagerFactory emf;
        EntityManager entityManager;
        EntityTransaction transaction;

        emf = Persistence.createEntityManagerFactory("jbd-pu");
        entityManager = emf.createEntityManager();
        transaction = entityManager.getTransaction();
        transaction.begin();

        entityManager.merge(focusGroup);
    }

    @GetMapping("/focus-groups/cancelable/{groupId}")
    public ResponseEntity<Boolean> isCancelable(@PathVariable Long groupId) {
        return ResponseEntity.ok().body(focusGroupService.isInProcess(groupId));
    }

    @GetMapping("/focus-groups/institution/{institutionId}")
    public List<FocusGroup> getFocusGroupsTestsByInstitution(@PathVariable Long institutionId) {
        log.debug("REST request to get all AptitudeTests");
        Institution institution = new Institution();
        institution.setId(institutionId);
        return focusGroupRepository.findAllByInstitution(institution);
    }

    @GetMapping("/focus-groups/find-by-test/{testId}")
    public ResponseEntity<Boolean> getFocusGroupByAptitudeTest(@PathVariable Long testId) {
        return ResponseEntity.ok().body(focusGroupService.testIsAvailable(testId));
    }

    @GetMapping("/focus-groups/aptitude-test/{testId}")
    public ResponseEntity<FocusGroup> getFocusGroupByTest(@PathVariable Long testId) {
        AptitudeTest test = new AptitudeTest();
        test.setId(testId);
        Optional<FocusGroup> optGroup = focusGroupRepository.findByAptitudeTest(test);
        return (optGroup.isPresent()) ? ResponseEntity.ok().body(optGroup.get()) : ResponseEntity.ok().body(new FocusGroup());
    }
    @GetMapping("/focus-groups/finish/{groupId}")
    public ResponseEntity<FocusGroup> finishFocusGroup(@PathVariable Long groupId) {
        return ResponseEntity.ok().body(focusGroupService.finishFocusGroup(groupId));
    }

    @PutMapping("/focus-groups/refund-participant-fare")
    public ResponseEntity<FocusGroup> removeParticapantAndRefundFare(@Valid @RequestBody FocusGroup group) throws URISyntaxException {
        log.debug("REST request to remove participant and refund of FocusGroup : {}", group);
        if (group.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        paymentService.returnParticipantFare(group);
        FocusGroup result = focusGroupRepository.save(group);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, group.getId().toString()))
            .body(result);
    }

}
