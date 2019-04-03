package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.AptitudeTest;
import com.mercury.palaver.repository.AptitudeTestRepository;
import com.mercury.palaver.service.AptitudeTestService;
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
 * REST controller for managing AptitudeTest.
 */
@RestController
@RequestMapping("/api")
public class AptitudeTestResource {

    private final Logger log = LoggerFactory.getLogger(AptitudeTestResource.class);

    private static final String ENTITY_NAME = "aptitudeTest";

    private final AptitudeTestRepository aptitudeTestRepository;

    private final AptitudeTestService aptitudeTestService;

    public AptitudeTestResource(AptitudeTestRepository aptitudeTestRepository, AptitudeTestService aptitudeTestService) {
        this.aptitudeTestRepository = aptitudeTestRepository;
        this.aptitudeTestService = aptitudeTestService;
    }

    /**
     * POST  /aptitude-tests : Create a new aptitudeTest.
     *
     * @param aptitudeTest the aptitudeTest to create
     * @return the ResponseEntity with status 201 (Created) and with body the new aptitudeTest, or with status 400 (Bad Request) if the aptitudeTest has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/aptitude-tests")
    public ResponseEntity<AptitudeTest> createAptitudeTest(@Valid @RequestBody AptitudeTest aptitudeTest) throws URISyntaxException {
        log.debug("REST request to save AptitudeTest : {}", aptitudeTest);
        if (aptitudeTest.getId() != null) {
            throw new BadRequestAlertException("A new aptitudeTest cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AptitudeTest result = aptitudeTestService.save(aptitudeTest);
        return ResponseEntity.created(new URI("/api/aptitude-tests/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /aptitude-tests : Updates an existing aptitudeTest.
     *
     * @param aptitudeTest the aptitudeTest to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated aptitudeTest,
     * or with status 400 (Bad Request) if the aptitudeTest is not valid,
     * or with status 500 (Internal Server Error) if the aptitudeTest couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/aptitude-tests")
    public ResponseEntity<AptitudeTest> updateAptitudeTest(@Valid @RequestBody AptitudeTest aptitudeTest) throws URISyntaxException {
        log.debug("REST request to update AptitudeTest : {}", aptitudeTest);
        if (aptitudeTest.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        AptitudeTest result = aptitudeTestService.update(aptitudeTest);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, aptitudeTest.getId().toString()))
            .body(result);
    }

    /**
     * GET  /aptitude-tests : get all the aptitudeTests.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of aptitudeTests in body
     */
    @GetMapping("/aptitude-tests")
    public List<AptitudeTest> getAllAptitudeTests() {
        log.debug("REST request to get all AptitudeTests");
        return aptitudeTestRepository.findAll();
    }

    /**
     * GET  /aptitude-tests/:id : get the "id" aptitudeTest.
     *
     * @param id the id of the aptitudeTest to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the aptitudeTest, or with status 404 (Not Found)
     */
    @GetMapping("/aptitude-tests/{id}")
    public ResponseEntity<AptitudeTest> getAptitudeTest(@PathVariable Long id) {
        log.debug("REST request to get AptitudeTest : {}", id);
        Optional<AptitudeTest> aptitudeTest = aptitudeTestRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(aptitudeTest);
    }

    /**
     * DELETE  /aptitude-tests/:id : delete the "id" aptitudeTest.
     *
     * @param id the id of the aptitudeTest to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/aptitude-tests/{id}")
    public ResponseEntity<Void> deleteAptitudeTest(@PathVariable Long id) {
        log.debug("REST request to delete AptitudeTest : {}", id);
        aptitudeTestService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/aptitude-tests/institution/{institutionId}")
    public List<AptitudeTest> getAllAptitudeTestsByInstitution(@PathVariable Long institutionId) {
        log.debug("REST request to get all AptitudeTests");
        return aptitudeTestService.findAllByInstitution(institutionId);
    }

    @GetMapping("/aptitude-tests/institution/available/{institutionId}")
    public List<AptitudeTest> getAllAvailableAptitudeTestsByInstitution(@PathVariable Long institutionId) {
        log.debug("REST request to get all AptitudeTests");
        return aptitudeTestService.findAllAvailableByInstitution(institutionId);
    }

    @GetMapping("/aptitude-tests/is-in-use/{testId}")
    public ResponseEntity<Boolean> isCancelable(@PathVariable Long testId) {
        return ResponseEntity.ok().body(aptitudeTestService.isInUse(testId));
    }
}
