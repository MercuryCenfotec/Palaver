package com.mercury.palaver.web.rest;
import com.mercury.palaver.domain.Institution;
import com.mercury.palaver.domain.User;
import com.mercury.palaver.repository.InstitutionRepository;
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
 * REST controller for managing Institution.
 */
@RestController
@RequestMapping("/api")
public class InstitutionResource {

    private final Logger log = LoggerFactory.getLogger(InstitutionResource.class);

    private static final String ENTITY_NAME = "institution";

    private final InstitutionRepository institutionRepository;

    public InstitutionResource(InstitutionRepository institutionRepository) {
        this.institutionRepository = institutionRepository;
    }

    /**
     * POST  /institutions : Create a new institution.
     *
     * @param institution the institution to create
     * @return the ResponseEntity with status 201 (Created) and with body the new institution, or with status 400 (Bad Request) if the institution has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/institutions")
    public ResponseEntity<Institution> createInstitution(@Valid @RequestBody Institution institution) throws URISyntaxException {
        log.debug("REST request to save Institution : {}", institution);
        if (institution.getId() != null) {
            throw new BadRequestAlertException("A new institution cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Institution result = institutionRepository.save(institution);

        return ResponseEntity.created(new URI("/api/institutions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /institutions : Updates an existing institution.
     *
     * @param institution the institution to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated institution,
     * or with status 400 (Bad Request) if the institution is not valid,
     * or with status 500 (Internal Server Error) if the institution couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/institutions")
    public ResponseEntity<Institution> updateInstitution(@Valid @RequestBody Institution institution) throws URISyntaxException {
        log.debug("REST request to update Institution : {}", institution);
        if (institution.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Institution result = institutionRepository.save(institution);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, institution.getId().toString()))
            .body(result);
    }

    /**
     * GET  /institutions : get all the institutions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of institutions in body
     */
    @GetMapping("/institutions")
    public List<Institution> getAllInstitutions() {
        log.debug("REST request to get all Institutions");
        return institutionRepository.findAll();
    }

    /**
     * GET  /institutions/:id : get the "id" institution.
     *
     * @param id the id of the institution to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the institution, or with status 404 (Not Found)
     */
    @GetMapping("/institutions/{id}")
    public ResponseEntity<Institution> getInstitution(@PathVariable Long id) {
        log.debug("REST request to get Institution : {}", id);
        Optional<Institution> institution = institutionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(institution);
    }

    /**
     * DELETE  /institutions/:id : delete the "id" institution.
     *
     * @param id the id of the institution to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/institutions/{id}")
    public ResponseEntity<Void> deleteInstitution(@PathVariable Long id) {
        log.debug("REST request to delete Institution : {}", id);
        institutionRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    @GetMapping("/institutions/user/{userId}")
    public ResponseEntity<Institution> getInstitutionByUserId(@PathVariable Long userId) {
        log.debug("REST request to get an institution by userID : {}", userId);
        User user = new User();
        user.setId(userId);
        Optional<Institution> institution = institutionRepository.findByUser_User(user);
        return ResponseUtil.wrapOrNotFound(institution);
    }
}
