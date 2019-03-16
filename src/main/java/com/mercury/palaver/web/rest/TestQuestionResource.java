package com.mercury.palaver.web.rest;

import com.mercury.palaver.domain.TestQuestion;
import com.mercury.palaver.repository.TestQuestionRepository;
import com.mercury.palaver.service.TestQuestionService;
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
 * REST controller for managing TestQuestion.
 */
@RestController
@RequestMapping("/api")
public class TestQuestionResource {

    private final Logger log = LoggerFactory.getLogger(TestQuestionResource.class);

    private static final String ENTITY_NAME = "testQuestion";

    private final TestQuestionRepository testQuestionRepository;

    private final TestQuestionService testQuestionService;

    public TestQuestionResource(TestQuestionRepository testQuestionRepository, TestQuestionService testQuestionService) {
        this.testQuestionRepository = testQuestionRepository;
        this.testQuestionService = testQuestionService;
    }

    /**
     * POST  /test-questions : Create a new testQuestion.
     *
     * @param testQuestion the testQuestion to create
     * @return the ResponseEntity with status 201 (Created) and with body the new testQuestion, or with status 400 (Bad Request) if the testQuestion has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/test-questions")
    public ResponseEntity<TestQuestion> createTestQuestion(@Valid @RequestBody TestQuestion testQuestion) throws URISyntaxException {
        log.debug("REST request to save TestQuestion : {}", testQuestion);
        if (testQuestion.getId() != null) {
            throw new BadRequestAlertException("A new testQuestion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TestQuestion result = testQuestionService.save(testQuestion);
        return ResponseEntity.created(new URI("/api/test-questions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /test-questions : Updates an existing testQuestion.
     *
     * @param testQuestion the testQuestion to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated testQuestion,
     * or with status 400 (Bad Request) if the testQuestion is not valid,
     * or with status 500 (Internal Server Error) if the testQuestion couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/test-questions")
    public ResponseEntity<TestQuestion> updateTestQuestion(@Valid @RequestBody TestQuestion testQuestion) throws URISyntaxException {
        log.debug("REST request to update TestQuestion : {}", testQuestion);
        if (testQuestion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TestQuestion result = testQuestionService.save(testQuestion);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, testQuestion.getId().toString()))
            .body(result);
    }

    /**
     * GET  /test-questions : get all the testQuestions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of testQuestions in body
     */
    @GetMapping("/test-questions")
    public List<TestQuestion> getAllTestQuestions() {
        log.debug("REST request to get all TestQuestions");
        return testQuestionRepository.findAll();
    }

    /**
     * GET  /test-questions/:id : get the "id" testQuestion.
     *
     * @param id the id of the testQuestion to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the testQuestion, or with status 404 (Not Found)
     */
    @GetMapping("/test-questions/{id}")
    public ResponseEntity<TestQuestion> getTestQuestion(@PathVariable Long id) {
        log.debug("REST request to get TestQuestion : {}", id);
        Optional<TestQuestion> testQuestion = testQuestionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(testQuestion);
    }

    /**
     * DELETE  /test-questions/:id : delete the "id" testQuestion.
     *
     * @param id the id of the testQuestion to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/test-questions/{id}")
    public ResponseEntity<Void> deleteTestQuestion(@PathVariable Long id) {
        log.debug("REST request to delete TestQuestion : {}", id);
        testQuestionRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/test-questions/aptitude/{id}")
    public List<TestQuestion> getAllByAptitudeTest(@PathVariable Long id) {
        log.debug("REST request to get all TestQuestions");
        return testQuestionService.findAllQuestionsAndAnswersByAptitudeTestId(id);
    }
}
