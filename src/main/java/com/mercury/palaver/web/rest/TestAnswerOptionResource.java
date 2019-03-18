package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.TestAnswerOption;
import com.mercury.palaver.domain.TestQuestion;
import com.mercury.palaver.repository.TestAnswerOptionRepository;
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

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing TestAnswerOption.
 */
@RestController
@RequestMapping("/api")
public class TestAnswerOptionResource {

    private final Logger log = LoggerFactory.getLogger(TestAnswerOptionResource.class);

    private static final String ENTITY_NAME = "testAnswerOption";

    private final TestAnswerOptionRepository testAnswerOptionRepository;

    public TestAnswerOptionResource(TestAnswerOptionRepository testAnswerOptionRepository) {
        this.testAnswerOptionRepository = testAnswerOptionRepository;
    }

    /**
     * POST  /test-answer-options : Create a new testAnswerOption.
     *
     * @param testAnswerOption the testAnswerOption to create
     * @return the ResponseEntity with status 201 (Created) and with body the new testAnswerOption, or with status 400 (Bad Request) if the testAnswerOption has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/test-answer-options")
    public ResponseEntity<TestAnswerOption> createTestAnswerOption(@Valid @RequestBody TestAnswerOption testAnswerOption) throws URISyntaxException {
        log.debug("REST request to save TestAnswerOption : {}", testAnswerOption);
        if (testAnswerOption.getId() != null) {
            throw new BadRequestAlertException("A new testAnswerOption cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TestAnswerOption result = testAnswerOptionRepository.save(testAnswerOption);
        return ResponseEntity.created(new URI("/api/test-answer-options/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /test-answer-options : Updates an existing testAnswerOption.
     *
     * @param testAnswerOption the testAnswerOption to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated testAnswerOption,
     * or with status 400 (Bad Request) if the testAnswerOption is not valid,
     * or with status 500 (Internal Server Error) if the testAnswerOption couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/test-answer-options")
    public ResponseEntity<TestAnswerOption> updateTestAnswerOption(@Valid @RequestBody TestAnswerOption testAnswerOption) throws URISyntaxException {
        log.debug("REST request to update TestAnswerOption : {}", testAnswerOption);
        if (testAnswerOption.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TestAnswerOption result = testAnswerOptionRepository.save(testAnswerOption);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, testAnswerOption.getId().toString()))
            .body(result);
    }

    /**
     * GET  /test-answer-options : get all the testAnswerOptions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of testAnswerOptions in body
     */
    @GetMapping("/test-answer-options")
    public List<TestAnswerOption> getAllTestAnswerOptions() {
        log.debug("REST request to get all TestAnswerOptions");
        return testAnswerOptionRepository.findAll();
    }

    /**
     * GET  /test-answer-options/:id : get the "id" testAnswerOption.
     *
     * @param id the id of the testAnswerOption to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the testAnswerOption, or with status 404 (Not Found)
     */
    @GetMapping("/test-answer-options/{id}")
    public ResponseEntity<TestAnswerOption> getTestAnswerOption(@PathVariable Long id) {
        log.debug("REST request to get TestAnswerOption : {}", id);
        Optional<TestAnswerOption> testAnswerOption = testAnswerOptionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(testAnswerOption);
    }

    /**
     * DELETE  /test-answer-options/:id : delete the "id" testAnswerOption.
     *
     * @param id the id of the testAnswerOption to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/test-answer-options/{id}")
    public ResponseEntity<Void> deleteTestAnswerOption(@PathVariable Long id) {
        log.debug("REST request to delete TestAnswerOption : {}", id);
        testAnswerOptionRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/test-answer-options/test-question/{id}")
    public HashSet<TestAnswerOption> getTestAnswerByTestQuestion(@PathVariable Long id) {
        log.debug("REST request to get all TestAnswerOptions");
        TestQuestion question = new TestQuestion();
        question.setId(id);
        return testAnswerOptionRepository.findAllByTestQuestion(question);
    }

}
