package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.FocusGroup;
import com.mercury.palaver.domain.TestResult;
import com.mercury.palaver.repository.TestResultRepository;
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
 * REST controller for managing TestResult.
 */
@RestController
@RequestMapping("/api")
public class TestResultResource {

    private final Logger log = LoggerFactory.getLogger(TestResultResource.class);

    private static final String ENTITY_NAME = "testResult";

    private final TestResultRepository testResultRepository;

    public TestResultResource(TestResultRepository testResultRepository) {
        this.testResultRepository = testResultRepository;
    }

    /**
     * POST  /test-results : Create a new testResult.
     *
     * @param testResult the testResult to create
     * @return the ResponseEntity with status 201 (Created) and with body the new testResult, or with status 400 (Bad Request) if the testResult has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/test-results")
    public ResponseEntity<TestResult> createTestResult(@Valid @RequestBody TestResult testResult) throws URISyntaxException {
        log.debug("REST request to save TestResult : {}", testResult);
        if (testResult.getId() != null) {
            throw new BadRequestAlertException("A new testResult cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TestResult result = testResultRepository.save(testResult);
        return ResponseEntity.created(new URI("/api/test-results/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /test-results : Updates an existing testResult.
     *
     * @param testResult the testResult to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated testResult,
     * or with status 400 (Bad Request) if the testResult is not valid,
     * or with status 500 (Internal Server Error) if the testResult couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/test-results")
    public ResponseEntity<TestResult> updateTestResult(@Valid @RequestBody TestResult testResult) throws URISyntaxException {
        log.debug("REST request to update TestResult : {}", testResult);
        if (testResult.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TestResult result = testResultRepository.save(testResult);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, testResult.getId().toString()))
            .body(result);
    }

    /**
     * GET  /test-results : get all the testResults.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of testResults in body
     */
    @GetMapping("/test-results")
    public List<TestResult> getAllTestResults() {
        log.debug("REST request to get all TestResults");
        return testResultRepository.findAll();
    }

    /**
     * GET  /test-results/:id : get the "id" testResult.
     *
     * @param id the id of the testResult to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the testResult, or with status 404 (Not Found)
     */
    @GetMapping("/test-results/{id}")
    public ResponseEntity<TestResult> getTestResult(@PathVariable Long id) {
        log.debug("REST request to get TestResult : {}", id);
        Optional<TestResult> testResult = testResultRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(testResult);
    }

    /**
     * DELETE  /test-results/:id : delete the "id" testResult.
     *
     * @param id the id of the testResult to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/test-results/{id}")
    public ResponseEntity<Void> deleteTestResult(@PathVariable Long id) {
        log.debug("REST request to delete TestResult : {}", id);
        testResultRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/test-results/focus-group/{groupId}")
    public List<TestResult> getAllAptitudeTestsByInstitution(@PathVariable Long groupId) {
        log.debug("REST request to get all AptitudeTests");
        FocusGroup group = new FocusGroup();
        group.setId(groupId);
        return testResultRepository.findAllByFocusGroup(group);
    }
}
