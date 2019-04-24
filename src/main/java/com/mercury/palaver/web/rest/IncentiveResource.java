package com.mercury.palaver.web.rest;

import com.mercury.palaver.domain.Incentive;
import com.mercury.palaver.repository.IncentiveRepository;
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
 * REST controller for managing Incentive.
 */
@RestController
@RequestMapping("/api")
public class IncentiveResource {

    private final Logger log = LoggerFactory.getLogger(IncentiveResource.class);

    private static final String ENTITY_NAME = "incentive";

    private final IncentiveRepository incentiveRepository;

    public IncentiveResource(IncentiveRepository incentiveRepository) {
        this.incentiveRepository = incentiveRepository;
    }

    /**
     * POST  /incentives : Create a new incentive.
     *
     * @param incentive the incentive to create
     * @return the ResponseEntity with status 201 (Created) and with body the new incentive, or with status 400 (Bad Request) if the incentive has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/incentives")
    public ResponseEntity<Incentive> createIncentive(@Valid @RequestBody Incentive incentive) throws URISyntaxException {
        log.debug("REST request to save Incentive : {}", incentive);
        if (incentive.getId() != null) {
            throw new BadRequestAlertException("A new incentive cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Incentive result = incentiveRepository.save(incentive);
        return ResponseEntity.created(new URI("/api/incentives/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * PUT  /incentives : Updates an existing incentive.
     *
     * @param incentive the incentive to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated incentive,
     * or with status 400 (Bad Request) if the incentive is not valid,
     * or with status 500 (Internal Server Error) if the incentive couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/incentives")
    public ResponseEntity<Incentive> updateIncentive(@Valid @RequestBody Incentive incentive) throws URISyntaxException {
        log.debug("REST request to update Incentive : {}", incentive);
        if (incentive.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Incentive result = incentiveRepository.save(incentive);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, incentive.getId().toString()))
                .body(result);
    }

    /**
     * GET  /incentives : get all the incentives.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of incentives in body
     */
    @GetMapping("/incentives")
    public List<Incentive> getAllIncentives() {
        log.debug("REST request to get all Incentives");
        return incentiveRepository.findAll();
    }

    /**
     * GET  /incentives/find_by_institution/:id : get the "id" of the incentive's institution.
     *
     * @param id the id of the institution of the incentive to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the incentive, or with status 404 (Not Found)
     */
    @GetMapping("/incentives/find_by_institution/{id}")
    public List<Incentive> getIncentiveByInstitution(@PathVariable Long id) {
        log.debug("REST request to get Incentive by institution id: {}", id);
        return incentiveRepository.findAllByInstitution_Id(id);
    }

    /**
     * GET  /incentives/find_by_institution/:id/:quantity : get the "id" of the incentive's institution.
     *
     * @param id the id of the institution of the incentive to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the incentive, or with status 404 (Not Found)
     */
    @GetMapping("/incentives/find_by_institution/{id}/{quantity}")
    public List<Incentive> getIncentiveAndInstitutionAndQuatity(@PathVariable Long id, @PathVariable int quantity) {
        log.debug("REST request to get Incentive by institution id and quantity: {}", id);
        return incentiveRepository.findAllByInstitution_IdAndQuantityAfter(id, quantity);
    }

    /**
     * GET  /incentives/:id : get the "id" incentive.
     *
     * @param id the id of the incentive to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the incentive, or with status 404 (Not Found)
     */
    @GetMapping("/incentives/{id}")
    public ResponseEntity<Incentive> getIncentive(@PathVariable Long id) {
        log.debug("REST request to get Incentive : {}", id);
        Optional<Incentive> incentive = incentiveRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(incentive);
    }

    /**
     * DELETE  /incentives/:id : delete the "id" incentive.
     *
     * @param id the id of the incentive to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/incentives/{id}")
    public ResponseEntity<Void> deleteIncentive(@PathVariable Long id) {
        log.debug("REST request to delete Incentive : {}", id);
        incentiveRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
